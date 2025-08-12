// routes/uploadRoutes.js
// Endpoint opcional para subir CSV con multer

const express = require('express');
const multer = require('multer');
const os = require('os');

// Configuración de destino temporal para archivos (directorio temporal del SO)
const upload = multer({ dest: os.tmpdir() });

const router = express.Router();
const { uploadCsv } = require('../controllers/uploadController');

router.post('/upload-csv', upload.single('file'), uploadCsv);

module.exports = router;


