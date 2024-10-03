// Import DataTypes from Sequelize to define the model fields
const { DataTypes } = require('sequelize');

// Import the sequelize instance to interact with the database
const sequelize = require('../database/database');

// Import related models for associations (Payment and User models)
const Payment = require('./Payment');
const User = require('./User');

// Define the DeletedPayment model, representing the table for deleted payments
const DeletedPayment = sequelize.define('DeletedPayment', {
    // Primary key 'id' field, auto-incrementing integer
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Foreign key to the Payment table, referencing the payment that was deleted
    paymentId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Cannot be null
        references: {
          model: Payment,  // Reference the Payment model
          key: 'id'        // Corresponds to the 'id' field in the Payment table
        },
        onDelete: 'CASCADE'  // When the associated payment is deleted, delete this record as well
    },
    // Foreign key to the User table, referencing the user who deleted the payment
    eliminadoPor: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Cannot be null
        references: {
          model: User,    // Reference the User model
          key: 'id'       // Corresponds to the 'id' field in the User table
        }
    },
    // Field for the date and time the payment was deleted, defaulting to the current date/time
    FechaEliminado: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW  // Automatically set the field to the current date/time
    }
}, {
    // Disable automatic timestamp fields (createdAt and updatedAt)
    timestamps: false
});

// Export the DeletedPayment model for use in other parts of the application
module.exports = DeletedPayment;
