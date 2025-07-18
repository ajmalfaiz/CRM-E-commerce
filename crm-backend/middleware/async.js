/**
 * @fileoverview Async Handler Middleware
 * @description Wraps async route handlers to automatically catch and forward errors
 * @version 1.0.0
 */

/**
 * Wraps an async route handler to automatically catch and forward errors
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped route handler that catches async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  // Wrap the async function in a Promise that resolves with the result
  // or rejects with any error that occurs
  Promise.resolve(fn(req, res, next)).catch((error) => {
    // Log the error for debugging purposes
    console.error('Async Handler Error:', error);
    
    // If headers have already been sent, delegate to the default Express error handler
    if (res.headersSent) {
      return next(error);
    }
    
    // If it's a custom error with status code, use that, otherwise default to 500
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An unexpected error occurred';
    
    // Send error response
    res.status(statusCode).json({
      success: false,
      error: {
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    });
  });
};

module.exports = asyncHandler;
