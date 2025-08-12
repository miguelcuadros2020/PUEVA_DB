// controllers/authController.js
// Autenticación básica: registro y login
// - Se usa bcrypt para almacenar/validar hash de contraseñas
// - No se agregan JWT ni sesiones: se devuelve un objeto simple { success, user }

const bcrypt = require('bcrypt');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

// Registro de usuario nuevo
exports.register = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'username already exists' });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, passwordHash, role]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

// Login: compara password con hash guardado
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required' });
    }
    const userRes = await pool.query('SELECT id, username, password_hash, role FROM users WHERE username = $1', [username]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    const user = userRes.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'invalid credentials' });
    }
    return res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};


