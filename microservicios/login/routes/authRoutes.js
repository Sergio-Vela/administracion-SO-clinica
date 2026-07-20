const express = require('express');
const { login, health } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/login', login);
router.get('/health', health);
router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado', user: req.user });
});

module.exports = router;
