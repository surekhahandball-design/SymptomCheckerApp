export const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Mongoose duplicate key (email / phone already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const messages = {
      email: 'Email already exists',
      mobileNumber: 'Phone number already registered',
    };
    return res.status(409).json({
      success: false,
      message: messages[field] || `${field} already exists`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || 'Validation failed',
      errors: messages,
    });
  }

  // CORS error
  if (err.message?.startsWith('CORS blocked')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}
