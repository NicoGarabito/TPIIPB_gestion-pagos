// Import DataTypes from Sequelize to define model fields
const { DataTypes } = require('sequelize');

// Import the sequelize instance for database connection
const sequelize = require('../database/database');

// Import the User model to associate with Payment
const User = require('./User');

// Define the Payment model, representing a table for payment records
const Payment = sequelize.define('Payment', {
  // Primary key 'id' field, auto-incrementing integer
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Date when the payment was made, cannot be null
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // Date when the payment record was created, default is the current date/time
  fechaCarga: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,   
  },
  // Amount of the payment, stored as a decimal value
  monto: {
    type: DataTypes.DECIMAL(10, 2),  // Up to 10 digits, 2 decimal places
    allowNull: false,
  },
  // Method of payment (e.g., credit card, cash), cannot be null
  formaPago: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Optional text field for payment description
  descripcion: {
    type: DataTypes.TEXT,
  },
  // Location where the payment was made, cannot be null
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Boolean field to mark if the payment is active, default is true
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // Date when the payment was deleted (if applicable)
  fechaEliminado: {
    type: DataTypes.DATE,
  }
});

// Define the relationship where each payment is associated with a user through 'userId'
Payment.belongsTo(User, { foreignKey: 'userId' });

// Export the Payment model for use in other parts of the application
module.exports = Payment;
