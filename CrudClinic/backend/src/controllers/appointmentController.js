// controllers/appointmentController.js
// CRUD de citas: lista con JOINs para mostrar nombres de paciente/doctor

const pool = require('../config/db');

exports.getAll = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.patient_id, p.name AS patient_name, p.email AS patient_email,
              a.doctor_id, d.name AS doctor_name, d.specialty,
              a.appointment_date, a.appointment_time, a.status, a.payment_method, a.amount, a.created_at
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors d ON d.id = a.doctor_id
       ORDER BY a.appointment_date DESC, a.appointment_time DESC, a.id DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('appointments getAll error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT a.id, a.patient_id, p.name AS patient_name, p.email AS patient_email,
              a.doctor_id, d.name AS doctor_name, d.specialty,
              a.appointment_date, a.appointment_time, a.status, a.payment_method, a.amount, a.created_at
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors d ON d.id = a.doctor_id
       WHERE a.id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('appointments getById error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount = 0 } = req.body;
    if (!patient_id || !doctor_id || !appointment_date || !appointment_time || !status || !payment_method) {
      return res.status(400).json({ message: 'missing fields' });
    }
    const result = await pool.query(
      `INSERT INTO appointments
         (patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount, created_at`,
      [patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('appointments create error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount } = req.body;
    const result = await pool.query(
      `UPDATE appointments
         SET patient_id = $1, doctor_id = $2, appointment_date = $3, appointment_time = $4,
             status = $5, payment_method = $6, amount = $7
       WHERE id = $8
       RETURNING id, patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount, created_at`,
      [patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('appointments update error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ message: 'not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('appointments remove error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};


