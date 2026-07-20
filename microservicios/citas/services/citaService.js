const pool = require('../db/database');

async function getAllCitas() {
  const result = await pool.query('SELECT id, paciente, fecha, hora, motivo, estado, created_at FROM citas ORDER BY id ASC');
  return result.rows;
}

async function getCitaById(id) {
  const result = await pool.query(
    'SELECT id, paciente, fecha, hora, motivo, estado, created_at FROM citas WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error('Cita no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
}

async function createCita(data) {
  const { paciente, fecha, hora, motivo, estado } = data;

  if (!paciente || !fecha || !hora || !motivo || estado === undefined) {
    const error = new Error('Todos los campos son requeridos');
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    'INSERT INTO citas (paciente, fecha, hora, motivo, estado, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, paciente, fecha, hora, motivo, estado, created_at',
    [paciente, fecha, hora, motivo, estado]
  );

  return result.rows[0];
}

async function updateCita(id, data) {
  const { paciente, fecha, hora, motivo, estado } = data;

  const result = await pool.query(
    'UPDATE citas SET paciente = COALESCE($2, paciente), fecha = COALESCE($3, fecha), hora = COALESCE($4, hora), motivo = COALESCE($5, motivo), estado = COALESCE($6, estado) WHERE id = $1 RETURNING id, paciente, fecha, hora, motivo, estado, created_at',
    [id, paciente, fecha, hora, motivo, estado]
  );

  if (result.rows.length === 0) {
    const error = new Error('Cita no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
}

async function deleteCita(id) {
  const result = await pool.query('DELETE FROM citas WHERE id = $1 RETURNING id', [id]);

  if (result.rowCount === 0) {
    const error = new Error('Cita no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return { success: true, id };
}

module.exports = {
  getAllCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita
};
