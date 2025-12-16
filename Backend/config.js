require('dotenv').config();
module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  db: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host:     process.env.DB_HOST,
    dialect:  'mariadb',
    logging:  false,
  },
  port: process.env.PORT || 3000
};
