// controllers/doctorController.js
// CRUD de doctores

const pool = require('../config/db');

exports.getAll = async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, specialty, created_at FROM doctors ORDER BY id ASC');
    return res.json(rows);
  } catch (err) {
    console.error('doctors getAll error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT id, name, specialty, created_at FROM doctors WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('doctors getById error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, specialty } = req.body;
    if (!name || !specialty) return res.status(400).json({ message: 'name and specialty are required' });
    const result = await pool.query(
      'INSERT INTO doctors (name, specialty) VALUES ($1, $2) RETURNING id, name, specialty, created_at',
      [name, specialty]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('doctors create error:', err);
    if (err.code === '23505') return res.status(409).json({ message: 'doctor already exists' });
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty } = req.body;
    const result = await pool.query(
      'UPDATE doctors SET name = $1, specialty = $2 WHERE id = $3 RETURNING id, name, specialty, created_at',
      [name, specialty, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('doctors update error:', err);
    if (err.code === '23505') return res.status(409).json({ message: 'doctor already exists' });
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ message: 'not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('doctors remove error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};


