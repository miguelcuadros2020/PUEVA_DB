// routes/queryRoutes.js
// Endpoints de consultas avanzadas

const express = require('express');
const router = express.Router();
const q = require('../controllers/queryController');

router.get('/appointments', q.allAppointments);
router.get('/appointments-by-doctor', q.appointmentsByDoctor);
router.get('/patients-with-many-appointments', q.patientsWithManyAppointments);
router.get('/doctors-appointments-last-month', q.doctorsAppointmentsLastMonth);
router.get('/income-by-payment', q.incomeByPayment);

module.exports = router;


