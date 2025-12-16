const express = require('express');
const { sequelize, User, Product, Review } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();
const bcrypt = require('bcrypt');

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: process.env.DEFAULT_ADMIN_PASSWORD,
  role: 'admin'
};

router.post('/reset', async (req, res) => {
  if (req.headers['x-secret'] !== 'MojSuperTajnyKlucz123') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    await Review.destroy({ where: {}, force: true });
    await Product.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    await sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE products AUTO_INCREMENT = 1');
    await sequelize.query('ALTER TABLE reviews AUTO_INCREMENT = 1');

    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
    await User.create({
      email: DEFAULT_ADMIN.email,
      passwordHash,
      role: DEFAULT_ADMIN.role
    });
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Reset failed', error: err.message });
  }
});

module.exports = router;