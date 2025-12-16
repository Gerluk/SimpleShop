const { Product, Review, User } = require('../models');
const { Op } = require('sequelize');

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, createdById: req.user.id });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, sort = 'price' } = req.query;
    const where = category ? { category } : {};
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      order: [[sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC']],
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [{ model: User, as: 'creator', attributes: ['id', 'email'] }]
    });

    res.json({
      meta: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      },
      data: rows
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email']
        }
      ]
    });
    if (!product) return res.status(404).json({ message: 'Nie znaleziono' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Nie znaleziono' });

    if (product.createdById !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Brak dostępu' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Nie znaleziono' });

    if (product.createdById !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Brak dostępu' });
    }

    await product.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
