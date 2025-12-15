const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({ code: err.code || 'SERVER_ERROR', message: err.message || 'Server error' });
};

export default errorHandler;
