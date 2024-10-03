// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Load environment variables from the .env file
require('dotenv').config();

// Middleware function for authentication and role-based authorization
// The 'roles' parameter is an optional array of roles that are allowed access
const authMiddleware = (roles = []) => {
  // Return the middleware function that checks the authorization header and token
  return (req, res, next) => {
    // Get the 'authorization' header from the request
    const authHeader = req.headers['authorization'];

    // If no authorization header is present, return a 403 Forbidden response
    if (!authHeader) return res.status(403).json({ message: 'token required' });

    // Extract the token part of the 'Bearer' token (after 'Bearer ')
    const token = authHeader.split(' ')[1];

    // If no token is found in the header, return a 403 Forbidden response
    if (!token) return res.status(403).json({ message: 'token required' });

    // Verify the token using the secret key from the environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // If the token is invalid or verification fails, return a 403 Forbidden response
      if (err) return res.status(403).json({ message: 'invalid token' });

      // If roles are specified and the user's role is not included, return a 401 Unauthorized response
      if (roles.length && !roles.includes(user.rol)) {
        return res.status(401).json({ message: 'No autorized' });
      }

      // Attach the verified user information to the request object
      req.user = user;
      
      // Call the next middleware function or route handler
      next();
    });
  };
};

// Export the middleware function for use in route protection
module.exports = authMiddleware;
