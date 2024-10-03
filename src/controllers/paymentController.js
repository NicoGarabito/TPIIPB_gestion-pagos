// Imports models
const Payment = require('../models/Payment');
const DeletedPayment = require('../models/DeletedPayment');

// Controller to create a new payment
exports.createPayment = async (req, res) => {
  try {
    // Extract payment details from the request body
    const { fechaPago, monto, formaPago, descripcion, ubicacion, userId } = req.body;
    
    // Create a new payment entry in the database
    const newPayment = await Payment.create({
      fechaPago,
      monto,
      formaPago,
      descripcion,
      ubicacion,
      userId,
    });

    // Send a success response with the new payment data
    res.status(201).json(newPayment);
  } 
  catch (error) {
    // Handle any error that occurs during payment creation
    res.status(500).json({ message: 'payment creation failed', error: error.message });
  }
};

// Controller to get payments, with different behavior based on user role
exports.getPayments = async (req, res) => {
  try {
    const { userId } = req.query;  // Get userId from query parameters
    
    // If the user role is 'usuario', fetch only their payments
    if (req.user.rol === 'usuario') {
      const payments = await Payment.findAll({
        where: { userId: req.user.id, activo: true },  // Only active payments
      });
      return res.status(200).json(payments);  // Return the payments for the user
    }

    // If the user has another role (e.g., admin), fetch payments by userId or logged-in user's id
    const payments = await Payment.findAll({
      where: { userId: userId || req.user.id, activo: true },  // Fetch payments for the specified user
    });
    
    res.status(200).json(payments);  // Return the payments
  } 
  catch (error) {
    // Handle any error that occurs during fetching payments
    res.status(500).json({ message: 'payment fetch failed', error: error.message });
  }
};

// Controller to update payment details, restricted to admin and super users
exports.updatePayment = async (req, res) => {
  const { id } = req.params;  // Get the payment id from the route parameters
  const { fechaPago, monto, formaPago, descripcion, ubicacion } = req.body;  // Get updated details from the request body

  // Restrict update to 'admin' or 'super' roles only
  // if (req.user.rol !== 'admin' && req.user.rol !== 'super') {
  //   return res.status(403).json({ message: 'No autorizado para actualizar pagos' });  // Forbidden response for unauthorized users
  // }

  try {
    const payment = await Payment.findByPk(id);  // Find payment by id

    // If payment is not found, return a 404 response
    if (!payment) {
      return res.status(404).json({ message: 'payment not found' });
    }

    // Attempt to update the payment with new details
    const [updated] = await Payment.update(
      { fechaPago, monto, formaPago, descripcion, ubicacion },  // Fields to update
      { where: { id } }  // Update where the id matches
    );

    // If the update was successful, return a success message
    if (updated) {
      return res.status(200).json({ message: 'payment updated successfully' });
    }

    // If no rows were updated, return a 304 (Not Modified) response
    return res.status(304).json({ message: 'El pago no se modifico' });
  } 
  catch (error) {
    // Handle any error that occurs during updating the payment
    res.status(500).json({ message: 'payment update failed', error: error.message });
  }
};

// Controller to soft delete (deactivate) a payment
exports.deletePayment = async (req, res) => {
  const { id } = req.params;  // Get the payment id from the route parameters

  try {
    const payment = await Payment.findByPk(id);  // Find payment by id

    // If the payment is not found, return a 404 response
    if (!payment) {
      return res.status(404).json({ message: 'payment not found' });
    }

    // Log the deletion by creating an entry in the DeletedPayment table
    await DeletedPayment.create({
      paymentId: payment.id,
      eliminadoPor: req.user.id,  // Record who deleted the payment
      FechaEliminado: new Date()  // Log the deletion date
    });

    // Deactivate the payment by updating its 'activo' status to false
    await Payment.update(
      { activo: false },  // Set 'activo' to false to mark as deleted
      { where: { id } }  // Where id matches the payment to be deleted
    );

    // Return a success message
    res.status(200).json({ message: 'payment deleted successfully' });
  } 
  catch (error) {
    // Handle any error that occurs during payment deletion
    res.status(500).json({ message: 'disablePayment error', error: error.message });
  }
};
