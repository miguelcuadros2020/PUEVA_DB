// controllers/patientController.js
// CRUD de pacientes con consultas parametrizadas para evitar SQL injection

const pool = require('../config/db');

// Listar todos los pacientes
exports.getAll = async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, phone, created_at FROM patients ORDER BY id ASC');
    return res.json(rows);
  } catch (err) {
    console.error('patients getAll error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

// Obtener un paciente por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT id, name, email, phone, created_at FROM patients WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('patients getById error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

// Crear paciente
exports.create = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ message: 'name, email, phone are required' });
    const result = await pool.query(
      'INSERT INTO patients (name, email, phone) VALUES ($1, $2, $3) RETURNING id, name, email, phone, created_at',
      [name, email, phone]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('patients create error:', err);
    if (err.code === '23505') return res.status(409).json({ message: 'email already exists' });
    return res.status(500).json({ message: 'internal error' });
  }
};

// Actualizar paciente
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const result = await pool.query(
      'UPDATE patients SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone, created_at',
      [name, email, phone, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('patients update error:', err);
    if (err.code === '23505') return res.status(409).json({ message: 'email already exists' });
    return res.status(500).json({ message: 'internal error' });
  }
};

// Eliminar paciente
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query('DELETE FROM patients WHERE id = $1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ message: 'not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('patients remove error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};


