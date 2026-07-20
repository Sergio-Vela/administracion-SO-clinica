require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const citaRoutes = require('./routes/citaRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();
const port = process.env.PORT || 4001;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', citaRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor de citas escuchando en el puerto ${port}`);
});
