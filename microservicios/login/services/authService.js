const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool: db } = require('../db/database');

async function loginUser(usuario, password) {
  const [rows] = await db.execute(
    'SELECT id, usuario, password, nombre, rol, estado FROM usuarios WHERE usuario = ? LIMIT 1',
    [usuario]
  );

  if (rows.length === 0) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const user = rows[0];

  if (user.estado !== 1) {
    const error = new Error('Usuario inactivo');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, usuario: user.usuario, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    usuario: user.usuario,
    nombre: user.nombre
  };
}

module.exports = {
  loginUser
};
