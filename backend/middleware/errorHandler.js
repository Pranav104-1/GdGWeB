const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  // Log to console for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({ success: false, message });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
