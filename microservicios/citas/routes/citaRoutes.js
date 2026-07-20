const express = require('express');
const { getAll, getById, create, update, remove, health } = require('../controllers/citaController');

const router = express.Router();

router.get('/health', health);
router.get('/citas', getAll);
router.get('/citas/:id', getById);
router.post('/citas', create);
router.put('/citas/:id', update);
router.delete('/citas/:id', remove);

module.exports = router;
