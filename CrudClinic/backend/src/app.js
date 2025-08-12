// app.js
// Punto de entrada del servidor Express
// - Carga variables de entorno
// - Configura middlewares
// - Expone rutas API y sirve el frontend estático

const path = require('path');
const express = require('express');
require('dotenv').config();

// Importar rutas API
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const queryRoutes = require('./routes/queryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware para parsear JSON en requests
app.use(express.json());

// Servir frontend estático desde carpeta /frontend
const staticDir = path.join(__dirname, '../../frontend');
app.use(express.static(staticDir));

// Registrar rutas bajo prefijo /api
app.use('/api', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api', uploadRoutes);

// Fallback para SPA simple (lleva al login)
app.get('*', (_req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Arrancar servidor en puerto configurado
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`CrudClinic API running on http://localhost:${PORT}`);
});


