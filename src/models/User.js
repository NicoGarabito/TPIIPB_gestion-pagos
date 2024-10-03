// Import DataTypes from Sequelize to define model fields
const { DataTypes } = require('sequelize');

// Import the sequelize instance for database connection
const sequelize = require('../database/database');

// Define the User model, representing a table for user accounts
const User = sequelize.define('User', {
  // Primary key 'id' field, auto-incrementing integer
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // User's name, stored as a string and cannot be null
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // User's email, stored as a string, must be unique and cannot be null
  correo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  // User's password, stored as a string and cannot be null
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // User role, can be 'super', 'admin', or 'usuario'; defaults to 'usuario'
  rol: {
    type: DataTypes.ENUM('super', 'admin', 'usuario'),
    defaultValue: 'usuario',   
  }
});

// Export the User model for use in other parts of the application
module.exports = User;
