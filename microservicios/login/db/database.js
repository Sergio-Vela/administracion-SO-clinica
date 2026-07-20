const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    await pool.query('ALTER TABLE usuarios MODIFY COLUMN password VARCHAR(255) NOT NULL');

    const [rows] = await pool.query('SELECT id FROM usuarios WHERE usuario = ? LIMIT 1', ['admin']);

    if (rows.length === 0) {
      const hash = await bcrypt.hash('sushi2026', 10);
      await pool.query(
        'INSERT INTO usuarios (usuario, password, nombre, rol, estado, created_at) VALUES (?, ?, ?, ?, ?, CURDATE())',
        ['admin', hash, 'Administrador', 1, 1]
      );
    } else {
      const hash = await bcrypt.hash('sushi2026', 10);
      await pool.query(
        'UPDATE usuarios SET password = ?, nombre = ?, rol = ?, estado = ? WHERE usuario = ?',
        [hash, 'Administrador', 1, 1, 'admin']
      );
    }
  } catch (error) {
    if (error && error.code !== 'ER_NO_SUCH_TABLE') {
      console.error('No se pudo inicializar la base de datos:', error.message);
    }
  }
}

module.exports = {
  pool,
  initializeDatabase
};
