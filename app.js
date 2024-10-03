// Import necessary modules and packages
const express = require('express'); // Web framework for Node.js
const sequelize = require('./src/database/database'); // Database connection instance using Sequelize
const userRoutes = require('./src/routes/userRoutes'); // User-related routes
const paymentRoutes = require('./src/routes/paymentRoutes'); // Payment-related routes
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
require('dotenv').config(); // Load environment variables from .env file
const { Server } = require('socket.io'); // Socket.io server for real-time communication
const http = require('http'); // Node.js HTTP module
const adminSocket = require('./src/sockets/adminSocket'); // Admin socket functionality

// Create an Express application
const app = express();

// Middleware to enable CORS
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Set up API routes
app.use('/api/users', userRoutes); // Routes for user operations
app.use('/api/payments', paymentRoutes); // Routes for payment operations

// Create an HTTP server using the Express app
const server = http.createServer(app);
// Create a Socket.io server attached to the HTTP server
const io = new Server(server);

// Set up socket connection and use the adminSocket functionality
io.on('connection', (socket) => {
  adminSocket(io, socket); // Handle admin socket connections
});

// Define the port to listen on, using the environment variable or defaulting to 3000
const PORT = process.env.PORT || 3000;

// Check if the environment is not 'test'
if (process.env.NODE_ENV !== 'test') {
  // Synchronize the database and start the server
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`); // Log server start message
    });
  })
  .catch(err => {
    console.error('BD sync error:', err); // Log any synchronization errors
    process.exit(1); // Exit the process with an error code
  });
}

// Export the app for use in other modules
module.exports = app;
