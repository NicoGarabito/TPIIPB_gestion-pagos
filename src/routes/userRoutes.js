// Import the express framework
const express = require('express');

// Import the user controller containing the logic for handling user requests
const userController = require('../controllers/userController');

// Create a new router instance from express
const router = express.Router();

// Define a POST route for user registration
// This route calls the register function from the user controller
router.post('/register', userController.register);

// Define a POST route for user login
// This route calls the login function from the user controller
router.post('/login', userController.login);

// Export the router to be used in the main application
module.exports = router;
