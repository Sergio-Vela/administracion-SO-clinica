require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');
const { initializeDatabase } = require('./db/database');

const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);

app.use(errorHandler);

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor de login escuchando en el puerto ${port}`);
  });
}).catch((error) => {
  console.error('Error al iniciar el servicio:', error);
  process.exit(1);
});
