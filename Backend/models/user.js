const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Email jest wymagany' },
        notEmpty: { msg: 'Email nie może być pusty' },
        isEmail: { 
          msg: 'Nieprawidłowy format emaila. Użyj formatu np. user@example.com',
          args: {
            allow_utf8_local_part: false,
            require_tld: true
          }
    },
    isLowercase: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Hasło jest wymagane' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        notNull: { msg: 'Rola jest wymagana' },
        isIn: {
          args: [['user', 'admin']],
          msg: 'Dozwolone role: user, admin'
        }
      }
    }
  });

  User.prototype.setPassword = async function (password) {
    this.passwordHash = await bcrypt.hash(password, 10);
  };

  User.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  return User;
};
