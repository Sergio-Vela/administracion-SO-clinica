const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ message: 'usuario y password son requeridos' });
    }

    const result = await authService.loginUser(usuario, password);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

function health(req, res) {
  return res.status(200).json({ status: 'ok' });
}

module.exports = {
  login,
  health
};
