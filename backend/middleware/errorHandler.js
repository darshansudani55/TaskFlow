/**
 * Centralized error handling middleware for Express.
 * Catches errors thrown anywhere in the application and returns a clean JSON response.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid task ID format';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'A resource with that value already exists';
  }

  // In production, don't leak stack traces
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
