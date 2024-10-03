// Import the express framework
const express = require('express');

// Import the payment controller containing the logic for handling payment requests
const paymentController = require('../controllers/paymentController');

// Create a new router instance from express
const router = express.Router();

// Import the authentication middleware to protect routes
const authMiddleware = require('../middlewares/authMiddleware');

// Define a POST route to create a payment
// This route requires the user to have 'admin' or 'super' role
router.post('/', authMiddleware(['admin', 'super']), paymentController.createPayment);

// Define a GET route to retrieve payments
// This route allows users with 'admin', 'super', or 'usuario' roles
router.get('/', authMiddleware(['admin', 'super', 'usuario']), paymentController.getPayments);

// Define a PUT route to update a specific payment by ID
// This route requires the user to have 'admin' or 'super' role
router.put('/:id', authMiddleware(['admin', 'super']), paymentController.updatePayment);

// Define a DELETE route to deactivate a specific payment by ID
// This route requires the user to have 'admin' or 'super' role
router.delete('/:id', authMiddleware(['admin', 'super']), paymentController.deletePayment);

// Export the router to be used in the main application
module.exports = router;
