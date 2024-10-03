const { createPayment, getPayments, updatePayment, deletePayment } = require('../controllers/paymentController'); 
const Payment = require('../models/Payment');   
const DeletedPayment = require('../models/DeletedPayment');

// Mocks de los modelos para las pruebas
jest.mock('../models/payment');
jest.mock('../models/deletedPayment');

describe('Payment Controller', () => {
  describe('createPayment', () => {
    test('must be able to create a new payment', async () => {
      const req = {
        body: {
          fechaPago: '2024-10-01',
          monto: 100,
          formaPago: 'tarjeta',
          descripcion: 'Pago por servicios',
          ubicacion: 'ruta/al/archivo.pdf',
          userId: 1 // ID del usuario que realiza el pago
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(), // Mock de la función status de la respuesta
        json: jest.fn() // Mock de la función json de la respuesta
      };

      // Mock de Payment.create para simular una respuesta exitosa
      Payment.create.mockResolvedValue(req.body);
      await createPayment(req, res); // Llama a la función createPayment

      // Verificaciones de las llamadas
      expect(Payment.create).toHaveBeenCalledWith(req.body);  
      expect(res.status).toHaveBeenCalledWith(201);   
      expect(res.json).toHaveBeenCalledWith(req.body); 
    });

    test('return error 500 if payment creation failed', async () => {
      const req = { body: {} };   
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock para simular un error al crear el pago
      Payment.create.mockRejectedValue(new Error('payment creation failed'));
      await createPayment(req, res);

      // Verificaciones de las llamadas
      expect(res.status).toHaveBeenCalledWith(500);     
      expect(res.json).toHaveBeenCalledWith({ message: 'payment creation failed', error: 'payment creation failed' });   
    });
  });

  describe('getPayments', () => {
    it('obtain all payments from logged-in user', async () => {
      const req = {
        user: { id: 1, rol: 'usuario' },  // Datos del usuario autenticado
        query: { userId: 1 }  // Parámetros de consulta
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      const mockPayments = [{ id: 1, monto: 100, activo: true }]; // Simulación de pagos
  
      // Mock de Payment.findAll para simular la obtención de pagos
      Payment.findAll = jest.fn().mockResolvedValue(mockPayments);
  
      await getPayments(req, res); // Llama a la función getPayments
  
      // Verificaciones de las llamadas
      expect(Payment.findAll).toHaveBeenCalledWith({ where: { userId: req.user.id, activo: true } });  
      expect(res.status).toHaveBeenCalledWith(200);   
      expect(res.json).toHaveBeenCalledWith(mockPayments);  
    });
  
    test('return error 500 if payment fetch failed', async () => {
      const req = {
        user: { id: 1, rol: 'usuario' },  
        query: { userId: 1 }   
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      // Mock para simular un error al obtener pagos
      Payment.findAll = jest.fn().mockRejectedValue(new Error('payment fetch failed'));
  
      await getPayments(req, res);
  
      // Verificaciones de las llamadas
      expect(res.status).toHaveBeenCalledWith(500);   
      expect(res.json).toHaveBeenCalledWith({ message: 'payment fetch failed', error: 'payment fetch failed' });  
    });
  });

  describe('updatePayment', () => {
    
    test('payment must be able to be updated', async () => {
      const req = {
        params: { id: 1 }, // ID del pago a actualizar
        body: { monto: 150 }, // Nuevos datos del pago
        user: { rol: 'admin' } // Rol del usuario
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock para simular la búsqueda y actualización del pago
      Payment.findByPk.mockResolvedValue({ id: 1 });
      Payment.update.mockResolvedValue([1]);

      await updatePayment(req, res); // Llama a la función updatePayment

      // Verificaciones de las llamadas
      expect(Payment.update).toHaveBeenCalledWith({ monto: 150 }, { where: { id: 1 } });  
      expect(res.status).toHaveBeenCalledWith(200);  
      expect(res.json).toHaveBeenCalledWith({ message: 'payment updated successfully' });   
    });

    test('return error 404 if payment not found', async () => {
      const req = {
        params: { id: 999 }, // ID no encontrado
        body: {},
        user: { rol: 'admin' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock para simular que no se encontró el pago
      Payment.findByPk.mockResolvedValue(null);

      await updatePayment(req, res);

      // Verificaciones de las llamadas
      expect(res.status).toHaveBeenCalledWith(404);  
      expect(res.json).toHaveBeenCalledWith({ message: 'payment not found' });  
    });

    test('return error 500 if payment update failed', async () => {
      const req = {
        params: { id: 1 },
        body: { monto: 150 },
        user: { rol: 'admin' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock para simular un error al actualizar el pago
      Payment.findByPk.mockResolvedValue({ id: 1 });
      Payment.update.mockRejectedValue(new Error('payment update failed'));

      await updatePayment(req, res);

      // Verificaciones de las llamadas
      expect(res.status).toHaveBeenCalledWith(500);   
      expect(res.json).toHaveBeenCalledWith({ message: 'payment update failed', error: 'payment update failed' });   
    });
  });

  describe('deletePayment', () => {
    test('disable payment and register deleted payment', async () => {
      const req = {
        params: { id: 1 }, // ID del pago a eliminar
        user: { id: 2 } // ID del usuario que elimina el pago
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockPayment = { id: 1, activo: true };   
      Payment.findByPk.mockResolvedValue(mockPayment);   
      DeletedPayment.create.mockResolvedValue({});  
      Payment.update.mockResolvedValue([1]);   

      await deletePayment(req, res); // Llama a la función deletePayment

      // Verificaciones de las llamadas
      expect(DeletedPayment.create).toHaveBeenCalledWith({
        paymentId: mockPayment.id, // ID del pago eliminado
        eliminadoPor: req.user.id, // ID del usuario que eliminó el pago
        FechaEliminado: expect.any(Date) // Fecha de eliminación
      });  
      expect(Payment.update).toHaveBeenCalledWith({ activo: false }, { where: { id: 1 } });  
      expect(res.status).toHaveBeenCalledWith(200);  
      expect(res.json).toHaveBeenCalledWith({ message: 'payment deleted successfully' });   
    });

    test('return error 404 if payment not found', async () => {
      const req = {
        params: { id: 999 }, // ID no encontrado
        user: { id: 1 }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock para simular que no se encontró el pago
      Payment.findByPk.mockResolvedValue(null);

      await deletePayment(req, res);

      // Verificaciones de las llamadas
      expect(res.status).toHaveBeenCalledWith(404);   
      expect(res.json).toHaveBeenCalledWith({ message: 'payment not found' });   
    });

    test('return error 500 if disablePayment error', async () => {
      const req = { params: { id: 1 }, user: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock para simular un error al deshabilitar el pago
      Payment.findByPk.mockRejectedValue(new Error('payment not found'));

      await deletePayment(req, res);

      // Verificaciones de las llamadas
      expect(res.status).toHaveBeenCalledWith(500);  
      expect(res.json).toHaveBeenCalledWith({ message: 'disablePayment error', error: 'payment not found' });  
    });
  });
});
