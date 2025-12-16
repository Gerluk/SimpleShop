const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const config  = require('./config');
const authR   = require('./routes/auth');
const userR   = require('./routes/users');
const prodR   = require('./routes/products');
const revR    = require('./routes/reviews');
const { authenticate } = require('./middleware/auth');
const errH    = require('./utils/errorHandler');
const testRoutes = require('./routes/test');

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  await sequelize.authenticate();
  console.log('Połączono z MariaDB');
  await sequelize.sync({ alter: true });
  console.log('Modele zsynchronizowane');
})();

app.use('/api/auth', authR);
app.use('/api/users', authenticate, userR);
app.use('/api/products', authenticate, prodR);
app.use('/api/reviews', authenticate, revR);
app.use('/api/test', testRoutes);
app.use(errH);

app.listen(config.port, () => console.log(`🚀 Serwer na porcie ${config.port}`));
