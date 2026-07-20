const citaService = require('../services/citaService');

async function getAll(req, res, next) {
  try {
    const citas = await citaService.getAllCitas();
    res.status(200).json(citas);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const cita = await citaService.getCitaById(req.params.id);
    res.status(200).json(cita);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const cita = await citaService.createCita(req.body);
    res.status(201).json(cita);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const cita = await citaService.updateCita(req.params.id, req.body);
    res.status(200).json(cita);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const result = await citaService.deleteCita(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

function health(req, res) {
  res.status(200).json({ status: 'ok' });
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  health
};
