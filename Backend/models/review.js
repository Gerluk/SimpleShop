const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Ocena jest wymagana' },
        notEmpty: { msg: 'Ocena nie może być pusta' },
        min: {
          args: [1],
          msg: 'Ocena nie może być niższa niż 1'
        },
        max: {
          args: [5],
          msg: 'Ocena nie może być wyższa niż 5'
        },
        isInt: {
          msg: 'Ocena musi być liczbą całkowitą'
        }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Komentarz może mieć maksymalnie 1000 znaków'
        }
      }
    }
  });

  return Review;
};
