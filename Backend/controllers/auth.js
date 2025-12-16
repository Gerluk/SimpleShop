const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (role === 'admin' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Tylko admin może tworzyć konta adminów' });
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Wymagane pola: email i hasło' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Nieprawidłowy format emaila. Użyj np. user@example.com' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Hasło musi mieć minimum 8 znaków' });
    }

    const user = User.build({ email, role });
    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(password, salt);
    await user.save();
    
    res.status(201).json({ message: 'Zarejestrowano pomyślnie' });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Błąd walidacji',
        errors: err.errors.map(e => e.message) 
      });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' , algorithm: 'HS512' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};