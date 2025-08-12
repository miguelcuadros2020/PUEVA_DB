// scripts/load-csv.js
// Script CLI para carga masiva desde CSV
// Uso: node src/scripts/load-csv.js --file=./data/appointments.csv

const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/db');

// Lectura de argumento --file
function getArg(name, def = undefined) {
  const prefix = `--${name}=`;
  const arg = process.argv.find(a => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : def;
}

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

(async () => {
  const file = getArg('file');
  if (!file || !fs.existsSync(file)) {
    console.error('CSV file not found. Use --file=path/to/file.csv');
    process.exit(1);
  }

  const rows = [];
  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        let inserted = 0;
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

          // Validación mínima de campos necesarios
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
          inserted++;
        }
        await client.query('COMMIT');
        console.log(`Inserted appointments: ${inserted}`);
        process.exit(0);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('load-csv error:', err);
        process.exit(2);
      } finally {
        client.release();
      }
    });
})();


