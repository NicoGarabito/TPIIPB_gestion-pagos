const request = require('supertest');  
const bcrypt = require('bcrypt');   
const jwt = require('jsonwebtoken');  
const app = require('../../app');   
const User = require('../models/User');   
const Login = require('../models/Login');   

// Se utilizan mocks para simular el comportamiento de las dependencias
jest.mock('bcrypt');  
jest.mock('jsonwebtoken');  

describe('User Controller', () => {
  
  // Tests para la ruta de registro de usuarios
  describe('POST /register', () => {
    
    // Test para registrar un nuevo usuario
    test('debería registrar un nuevo usuario', async () => {
      
      // Simula que no se encuentra un usuario con el correo proporcionado
      User.findOne = jest.fn().mockResolvedValue(null);   
      
      // Simula el hash de la contraseña
      bcrypt.hash.mockResolvedValue('hashedPassword');   
      
      // Simula la creación de un usuario en la base de datos
      User.create = jest.fn().mockResolvedValue({
        id: 8,
        nombre: 'Juan',
        correo: 'juan8@example.com',
        rol: 'usuario',
      });
      
      // Realiza una solicitud POST para registrar un usuario
      const response = await request(app)
        .post('/api/users/register')
        .send({
          nombre: 'Juan',
          correo: 'juan8@example.com',
          contraseña: 'password123',
          rol: 'usuario',
        });
      
      // Verifica que el estado de la respuesta sea 201 (creado)
      expect(response.status).toBe(201);   
      // Verifica que el nombre del usuario sea el esperado
      expect(response.body.nombre).toBe('Juan');  
      // Verifica que se haya llamado a User.findOne con el correo correcto
      expect(User.findOne).toHaveBeenCalledWith({ where: { correo: 'juan8@example.com' } });   
      // Verifica que se haya llamado a User.create
      expect(User.create).toHaveBeenCalled();   
    });

    // Test para manejar el caso en que el correo ya está registrado
    test('debería devolver un error si el correo ya está registrado', async () => {
      // Simula que se encuentra un usuario con el correo proporcionado
      User.findOne = jest.fn().mockResolvedValue({
        id: 8,
        nombre: 'Juan',
        correo: 'juan8@example.com',
      });

      // Realiza una solicitud POST para registrar un usuario
      const response = await request(app)
        .post('/api/users/register')
        .send({
          nombre: 'Juan',
          correo: 'juan8@example.com',
          contraseña: 'password123',
          rol: 'usuario',
        });
      
      // Verifica que el estado de la respuesta sea 409 (conflicto)
      expect(response.status).toBe(409);  
      // Verifica que el mensaje de error sea el esperado
      expect(response.body.message).toBe('email already exist');   
    });
  });

  // Tests para la ruta de inicio de sesión de usuarios
  describe('POST /login', () => {
    
    // Test para iniciar sesión correctamente con credenciales válidas
    test('debería hacer login correctamente con credenciales válidas', async () => {
      // Simula que se encuentra un usuario con las credenciales proporcionadas
      User.findOne = jest.fn().mockResolvedValue({
        id: 8,
        nombre: 'Juan',
        correo: 'juan8@example.com',
        contraseña: 'hashedPassword',
        rol: 'usuario',
      });
      
      // Simula la comparación de contraseñas
      bcrypt.compare.mockResolvedValue(true);
      // Simula la generación de un token JWT
      jwt.sign.mockReturnValue('mockToken');
      // Simula la creación de un registro de inicio de sesión
      Login.create = jest.fn().mockResolvedValue({});

      // Realiza una solicitud POST para iniciar sesión
      const response = await request(app)
        .post('/api/users/login')
        .send({
          correo: 'juan8@example.com',
          contraseña: 'password123',
        });

      // Verifica que el estado de la respuesta sea 200 (ok)
      expect(response.status).toBe(200);  
      // Verifica que el token devuelto sea el esperado
      expect(response.body.token).toBe('mockToken');   
      // Verifica que se haya llamado a User.findOne con el correo correcto
      expect(User.findOne).toHaveBeenCalledWith({ where: { correo: 'juan8@example.com' } });  
      // Verifica que se haya llamado a jwt.sign con los parámetros correctos
      expect(jwt.sign).toHaveBeenCalledWith({ id: 8, rol: 'usuario' }, process.env.JWT_SECRET);   
      // Verifica que se haya llamado a Login.create con el userId correcto
      expect(Login.create).toHaveBeenCalledWith({ userId: 8 }); 
    });

    // Test para manejar el caso en que las credenciales son inválidas
    test('debería devolver un error si las credenciales son inválidas', async () => {
      // Simula que no se encuentra un usuario con las credenciales proporcionadas
      User.findOne = jest.fn().mockResolvedValue(null);
      // Realiza una solicitud POST para iniciar sesión con credenciales incorrectas
      const response = await request(app)
        .post('/api/users/login')
        .send({
          correo: 'juan8@example.com',
          contraseña: 'wrongpassword',
        });

      // Verifica que el estado de la respuesta sea 401 (no autorizado)
      expect(response.status).toBe(401);  
      // Verifica que el mensaje de error sea el esperado
      expect(response.body.message).toBe('wrong email or password');  
    });
  });
});
