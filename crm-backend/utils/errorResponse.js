/**
 * @fileoverview Error Response Utility
 * @description Custom error class to handle API errors consistently
 * @version 1.0.0
 */

class ErrorResponse extends Error {
  /**
   * Create a new ErrorResponse instance
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a new ErrorResponse for not found errors
   * @param {string} resource - Name of the resource that wasn't found
   * @returns {ErrorResponse} New ErrorResponse instance
   */
  static notFound(resource) {
    return new ErrorResponse(`${resource} not found`, 404);
  }

  /**
   * Create a new ErrorResponse for validation errors
   * @param {Array} errors - Array of validation errors
   * @returns {ErrorResponse} New ErrorResponse instance
   */
  static validationError(errors) {
    const error = new ErrorResponse('Validation failed', 400);
    error.errors = errors;
    return error;
  }

  /**
   * Create a new ErrorResponse for unauthorized access
   * @param {string} message - Custom error message
   * @returns {ErrorResponse} New ErrorResponse instance
   */
  static unauthorized(message = 'Not authorized to access this route') {
    return new ErrorResponse(message, 401);
  }

  /**
   * Create a new ErrorResponse for forbidden access
   * @param {string} message - Custom error message
   * @returns {ErrorResponse} New ErrorResponse instance
   */
  static forbidden(message = 'Access forbidden') {
    return new ErrorResponse(message, 403);
  }

  /**
   * Create a new ErrorResponse for bad requests
   * @param {string} message - Custom error message
   * @returns {ErrorResponse} New ErrorResponse instance
   */
  static badRequest(message = 'Bad request') {
    return new ErrorResponse(message, 400);
  }

  /**
   * Create a new ErrorResponse for server errors
   * @param {string} message - Custom error message
   * @returns {ErrorResponse} New ErrorResponse instance
   */
  static serverError(message = 'Internal server error') {
    return new ErrorResponse(message, 500);
  }
}

module.exports = ErrorResponse;
