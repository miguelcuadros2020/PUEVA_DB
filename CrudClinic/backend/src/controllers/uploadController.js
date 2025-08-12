// controllers/uploadController.js
// Endpoint para subir CSV y cargar citas de manera masiva
// - Usa csv-parser para leer filas
// - Upsert básico de pacientes y doctores por email y (name,specialty)
// - Inserta citas con consultas parametrizadas

const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/db');

async function upsertPatient(client, name, email, phone) {
  const existing = await client.query('SELECT id FROM patients WHERE email = $1', [email]);
  if (existing.rows.length > 0) return existing.rows[0].id;
  const ins = await client.query(
    'INSERT INTO patients (name, email, phone) VALUES ($1, $2, $3) RETURNING id',
    [name, email, phone]
  );
  return ins.rows[0].id;
}

async function upsertDoctor(client, name, specialty) {
  const existing = await client.query('SELECT id FROM doctors WHERE name = $1 AND specialty = $2', [name, specialty]);
  if (existing.rows.length > 0) return existing.rows[0].id;
  const ins = await client.query(
    'INSERT INTO doctors (name, specialty) VALUES ($1, $2) RETURNING id',
    [name, specialty]
  );
  return ins.rows[0].id;
}

exports.uploadCsv = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'file is required' });

  const filePath = req.file.path;
  const rows = [];

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', async () => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          for (const row of rows) {
            const patientName = (row.patient_name || '').trim();
            const patientEmail = (row.patient_email || '').trim();
            const patientPhone = (row.patient_phone || '').trim();
            const doctorName = (row.doctor_name || '').trim();
            const doctorSpecialty = (row.doctor_specialty || '').trim();
            const appointmentDate = (row.appointment_date || '').trim();
            const appointmentTime = (row.appointment_time || '').trim();
            const status = (row.status || '').trim();
            const paymentMethod = (row.payment_method || '').trim();
            const amount = Number(row.amount || 0);

            // Validación básica: campos obligatorios
            if (!patientName || !patientEmail || !patientPhone || !doctorName || !doctorSpecialty ||
                !appointmentDate || !appointmentTime || !status || !paymentMethod) {
              continue;
            }

            const patientId = await upsertPatient(client, patientName, patientEmail, patientPhone);
            const doctorId = await upsertDoctor(client, doctorName, doctorSpecialty);

            await client.query(
              `INSERT INTO appointments
                 (patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [patientId, doctorId, appointmentDate, appointmentTime, status, paymentMethod, amount]
            );
          }
          await client.query('COMMIT');
          return res.json({ success: true, inserted: rows.length });
        } catch (err) {
          await client.query('ROLLBACK');
          console.error('uploadCsv error:', err);
          return res.status(500).json({ message: 'internal error' });
        } finally {
          client.release();
          fs.unlink(filePath, () => {});
        }
      });
  } catch (err) {
    console.error('uploadCsv stream error:', err);
    fs.unlink(filePath, () => {});
    return res.status(500).json({ message: 'internal error' });
  }
};


