// Import Sequelize from the sequelize package
const { Sequelize } = require('sequelize');

// Load environment variables from the .env file
require('dotenv').config();   

// Create a new Sequelize instance to connect to the database
const sequelize = new Sequelize(
  process.env.DB_NAME,   // Database name from environment variables
  process.env.DB_USER,   // Database user from environment variables
  process.env.DB_PASSWORD,   // Database password from environment variables
  {
    host: 'localhost',   // Host where the database is running
    dialect: 'mariadb',  // Specify MariaDB as the SQL dialect
  }
);

// Export the sequelize instance to be used in other parts of the application
module.exports = sequelize;
