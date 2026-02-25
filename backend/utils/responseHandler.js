// Send success response
exports.sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Send error response
exports.sendError = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error && { error }),
  });
};

// Standard success responses
exports.success = {
  created: (res, message = "Resource created successfully", data = null) => {
    return exports.sendSuccess(res, 201, message, data);
  },
  ok: (res, message = "Request successful", data = null) => {
    return exports.sendSuccess(res, 200, message, data);
  },
};

// Standard error responses
exports.error = {
  badRequest: (res, message = "Bad request") => {
    return exports.sendError(res, 400, message);
  },
  unauthorized: (res, message = "Unauthorized access") => {
    return exports.sendError(res, 401, message);
  },
  forbidden: (res, message = "Access forbidden") => {
    return exports.sendError(res, 403, message);
  },
  notFound: (res, message = "Resource not found") => {
    return exports.sendError(res, 404, message);
  },
  conflict: (res, message = "Conflict") => {
    return exports.sendError(res, 409, message);
  },
  serverError: (res, message = "Internal server error") => {
    return exports.sendError(res, 500, message);
  },
};
