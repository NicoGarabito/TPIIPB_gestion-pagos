// Import DataTypes from Sequelize to define the model fields
const { DataTypes } = require('sequelize');

// Import the sequelize instance to interact with the database
const sequelize = require('../database/database');

// Import the User model for the foreign key association
const user = require('./User');

// Define the Login model, representing the table for user login records
const Login = sequelize.define('Login', {
    // Primary key 'id' field, auto-incrementing integer
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Foreign key to the User table, referencing the user who logged in
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,  // Cannot be null
    },
    // Field for the time of login, defaulting to the current date/time
    loginTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Automatically set to the current date/time when a new record is created
    }
});

// Define the relationship where each login belongs to a user, using 'userId' as the foreign key
Login.belongsTo(user, { foreignKey: 'userId' });

// Export the Login model for use in other parts of the application
module.exports = Login;
