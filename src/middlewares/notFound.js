const notFound = (req, res, next) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found' });
};

export default notFound;
