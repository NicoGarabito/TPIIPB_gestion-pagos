// Imports models and libraries
const User = require('../models/User');  // User model
const Login = require('../models/Login');   // Login model to track login history
const jwt = require('jsonwebtoken');  // JWT library for generating tokens
const bcrypt = require('bcrypt');  // bcrypt for hashing and comparing passwords

// Controller to handle user registration
exports.register = async (req, res) => {
  // Extract user details from the request body
  const { nombre, correo, contraseña, rol } = req.body;

  // Check if a user with the same email already exists
  const user = await User.findOne({ where: { correo } });
  
  if (user) {
    // If email already exists, return a 409 Conflict response
    return res.status(409).json({ message: 'email already exist' });
  }

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(contraseña, 10);   

  // Create a new user with the hashed password and provided details
  const newUser = await User.create({
    nombre,
    correo,
    contraseña: hashedPassword,  // Store hashed password
    rol,
  });

  // Respond with the newly created user (201 Created)
  res.status(201).json(newUser);
};

// Controller to handle user login
exports.login = async (req, res) => {
  // Extract login credentials from the request body
  const { correo, contraseña } = req.body;

  // Find the user by email
  const user = await User.findOne({ where: { correo } });  

  // Check if user exists and the password matches using bcrypt comparison
  if (!user || !await bcrypt.compare(contraseña, user.contraseña)) {
    // If user is not found or password doesn't match, return a 401 Unauthorized response
    return res.status(401).json({ message: 'wrong email or password' });
  }

  // Generate a JWT token with the user's id and role, signing it with the secret
  const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET);
  
  // Record the login in the Login model (e.g., for audit or tracking purposes)
  await Login.create({ userId: user.id });

  // Return the JWT token in the response
  res.status(200).json({ token });
};
