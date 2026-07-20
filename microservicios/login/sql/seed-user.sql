USE login_db;

INSERT INTO usuarios (id, usuario, password, nombre, rol, estado, created_at)
VALUES (
  1,
  'admin',
  '$2b$10$dmsSfLx/Y4IeRl4rNTYxGuKdJ2RQ2gixVoFY17dS0Dd97egpq6kDO',
  'Administrador',
  1,
  1,
  CURDATE()
);
