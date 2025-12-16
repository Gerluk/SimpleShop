const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.getMe = (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
};

exports.update = async (req, res, next) => {
  try {
    req.user.email = req.body.email || req.user.email;
    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res.status(400).json({ message: 'Hasło musi mieć co najmniej 8 znaków.' });
      }
      const salt = await bcrypt.genSalt(12);
      req.user.passwordHash = await bcrypt.hash(req.body.password, salt);
    }
    await req.user.save();
    res.json({ message: 'Zaktualizowano' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await req.user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'role'] });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email', 'role']
    });
    if (!user) return res.status(404).json({ message: 'Nie znaleziono użytkownika.' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.removeOne = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Nie znaleziono użytkownika.' });
    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
