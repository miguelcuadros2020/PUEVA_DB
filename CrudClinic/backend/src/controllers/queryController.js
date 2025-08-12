// controllers/queryController.js
// Endpoints de consultas avanzadas para reportes

const pool = require('../config/db');

// Listado completo de citas con detalle de paciente y doctor
exports.allAppointments = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.id,
              p.name AS patient_name, p.email AS patient_email, p.phone AS patient_phone,
              d.name AS doctor_name, d.specialty,
              a.appointment_date, a.appointment_time, a.status, a.payment_method, a.amount
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors d ON d.id = a.doctor_id
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('queries allAppointments error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

// Citas por doctor en rango de fechas
exports.appointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId, startDate, endDate } = req.query;
    if (!doctorId || !startDate || !endDate) {
      return res.status(400).json({ message: 'doctorId, startDate, endDate are required' });
    }
    const { rows } = await pool.query(
      `SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.payment_method, a.amount,
              p.name AS patient_name, d.name AS doctor_name, d.specialty
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors d ON d.id = a.doctor_id
       WHERE a.doctor_id = $1
         AND a.appointment_date BETWEEN $2 AND $3
       ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
      [doctorId, startDate, endDate]
    );
    return res.json(rows);
  } catch (err) {
    console.error('queries appointmentsByDoctor error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

// Pacientes con más de 3 citas
exports.patientsWithManyAppointments = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id AS patient_id, p.name AS patient_name, p.email, COUNT(*) AS appointments_count
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       GROUP BY p.id, p.name, p.email
       HAVING COUNT(*) > 3
       ORDER BY appointments_count DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('queries patientsWithManyAppointments error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

// Citas por doctor en el último mes
exports.doctorsAppointmentsLastMonth = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.id AS doctor_id, d.name AS doctor_name, d.specialty, COUNT(*) AS appointments_count
       FROM appointments a
       JOIN doctors d ON d.id = a.doctor_id
       WHERE a.appointment_date >= (CURRENT_DATE - INTERVAL '1 month')
         AND a.appointment_date < CURRENT_DATE + INTERVAL '1 day'
       GROUP BY d.id, d.name, d.specialty
       ORDER BY appointments_count DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('queries doctorsAppointmentsLastMonth error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};

// Ingresos por método de pago en un rango de fechas
exports.incomeByPayment = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }
    const { rows } = await pool.query(
      `SELECT payment_method, SUM(amount) AS total_amount, COUNT(*) AS count
       FROM appointments
       WHERE appointment_date BETWEEN $1 AND $2
       GROUP BY payment_method
       ORDER BY total_amount DESC`,
      [startDate, endDate]
    );
    return res.json(rows);
  } catch (err) {
    console.error('queries incomeByPayment error:', err);
    return res.status(500).json({ message: 'internal error' });
  }
};


