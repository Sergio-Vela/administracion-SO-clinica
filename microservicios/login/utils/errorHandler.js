function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  console.error(`[${new Date().toISOString()}] ${message}`);

  res.status(statusCode).json({
    message
  });
}

module.exports = errorHandler;
