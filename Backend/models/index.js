const { Sequelize } = require('sequelize');
const config = require('../config').db;
const sequelize = new Sequelize(config);

const User    = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Review  = require('./review')(sequelize);

User.hasMany(Product,  { foreignKey: 'createdById', as: 'products' });
Product.belongsTo(User,{ foreignKey: 'createdById', as: 'creator' });
Product.hasMany(Review, { foreignKey: 'productId',   as: 'reviews' });
Review.belongsTo(Product,{ foreignKey: 'productId' });
User.hasMany(Review,    { foreignKey: 'authorId',    as: 'reviewsAuthored' });
Review.belongsTo(User,  { foreignKey: 'authorId',    as: 'author' });

module.exports = { sequelize, User, Product, Review };
