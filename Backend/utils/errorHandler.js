module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'SequelizeValidationError')
    return res.status(400).json({ message: err.errors.map(e=>e.message) });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};
