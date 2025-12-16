const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Brak tokenu' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, jwtSecret, { algorithms: ['HS512'] });
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'Nieprawidłowy token' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token nieprawidłowy' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Brak uprawnień' });
  }
  next();
};

module.exports = {
  authenticate,
  isAdmin,
};