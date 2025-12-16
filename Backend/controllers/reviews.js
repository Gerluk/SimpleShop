const { Review, Product } = require('../models');

exports.create = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (rating === undefined || rating === null) {
      return res.status(400).json({ message: 'Ocena jest wymagana' });
    }
    
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Produkt nie istnieje' });

    const review = await Review.create({
      rating,
      comment,
      productId,
      authorId: req.user.id
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review || review.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Brak dostępu' });
    }

    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review || (review.authorId !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Brak dostępu' });
    }

    await review.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
