/**
 * CrudClinic - Backend Súper Simple
 * Todo en un solo archivo para principiantes
 */

const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('../frontend'));

// Configuración de base de datos
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'crudclinic'
});

// ===== FUNCIONES DE BASE DE DATOS =====

// Crear tablas si no existen
async function crearTablas() {
    try {
        // Tabla de usuarios
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'user'
            )
        `);

        // Tabla de pacientes
        await pool.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20)
            )
        `);

        // Tabla de doctores
        await pool.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                specialty VARCHAR(100) NOT NULL
            )
        `);

        // Tabla de citas
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                patient_id INT NOT NULL REFERENCES patients(id),
                doctor_id INT NOT NULL REFERENCES doctors(id),
                appointment_date DATE NOT NULL,
                appointment_time TIME NOT NULL,
                status VARCHAR(30) NOT NULL DEFAULT 'programada',
                payment_method VARCHAR(30) NOT NULL DEFAULT 'efectivo',
                amount NUMERIC(10,2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('✅ Tablas creadas correctamente');
    } catch (error) {
        console.error('❌ Error creando tablas:', error);
    }
}

// Insertar datos de ejemplo
async function insertarDatosEjemplo() {
    try {
        // Usuario admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        await pool.query(`
            INSERT INTO users (username, password_hash, role) 
            VALUES ('admin', $1, 'admin') 
            ON CONFLICT (username) DO NOTHING
        `, [adminPassword]);

        // Pacientes de ejemplo
        await pool.query(`
            INSERT INTO patients (name, email, phone) VALUES 
            ('Juan Pérez', 'juan@email.com', '123-456-7890'),
            ('Ana García', 'ana@email.com', '098-765-4321'),
            ('Carlos López', 'carlos@email.com', '555-123-4567')
            ON CONFLICT (email) DO NOTHING
        `);

        // Doctores de ejemplo
        await pool.query(`
            INSERT INTO doctors (name, specialty) VALUES 
            ('Dr. María Rodríguez', 'Cardiología'),
            ('Dr. Pedro Sánchez', 'Dermatología'),
            ('Dr. Laura Torres', 'Pediatría')
            ON CONFLICT DO NOTHING
        `);

        console.log('✅ Datos de ejemplo insertados');
    } catch (error) {
        console.error('❌ Error insertando datos:', error);
    }
}

// ===== RUTAS DE AUTENTICACIÓN =====

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
        }

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        const passwordCorrect = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordCorrect) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error interno' });
    }
});

// Registro
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role = 'user' } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        
        await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
            [username, passwordHash, role]
        );

        res.json({ success: true, message: 'Usuario creado exitosamente' });
    } catch (error) {
        if (error.code === '23505') { // Error de duplicado
            res.status(400).json({ success: false, message: 'El usuario ya existe' });
        } else {
            console.error('Error en registro:', error);
            res.status(500).json({ success: false, message: 'Error interno' });
        }
    }
});

// ===== RUTAS DE PACIENTES =====

// Obtener todos los pacientes
app.get('/api/patients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM patients ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo pacientes:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Crear paciente
app.post('/api/patients', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const result = await pool.query(
            'INSERT INTO patients (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
            [name, email, phone]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creando paciente:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Actualizar paciente
app.put('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const result = await pool.query(
            'UPDATE patients SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *',
            [name, email, phone, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error actualizando paciente:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Eliminar paciente
app.delete('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM patients WHERE id = $1', [id]);
        res.json({ message: 'Paciente eliminado' });
    } catch (error) {
        console.error('Error eliminando paciente:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// ===== RUTAS DE DOCTORES =====

// Obtener todos los doctores
app.get('/api/doctors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM doctors ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo doctores:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Crear doctor
app.post('/api/doctors', async (req, res) => {
    try {
        const { name, specialty } = req.body;
        const result = await pool.query(
            'INSERT INTO doctors (name, specialty) VALUES ($1, $2) RETURNING *',
            [name, specialty]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creando doctor:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Actualizar doctor
app.put('/api/doctors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialty } = req.body;
        const result = await pool.query(
            'UPDATE doctors SET name = $1, specialty = $2 WHERE id = $3 RETURNING *',
            [name, specialty, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error actualizando doctor:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Eliminar doctor
app.delete('/api/doctors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM doctors WHERE id = $1', [id]);
        res.json({ message: 'Doctor eliminado' });
    } catch (error) {
        console.error('Error eliminando doctor:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// ===== RUTAS DE CITAS =====

// Obtener todas las citas con información completa
app.get('/api/appointments', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                a.*,
                p.name as patient_name,
                d.name as doctor_name,
                d.specialty
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error obteniendo citas:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Crear cita
app.post('/api/appointments', async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount } = req.body;
        const result = await pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creando cita:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Actualizar cita
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount } = req.body;
        const result = await pool.query(
            'UPDATE appointments SET patient_id = $1, doctor_id = $2, appointment_date = $3, appointment_time = $4, status = $5, payment_method = $6, amount = $7 WHERE id = $8 RETURNING *',
            [patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error actualizando cita:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Eliminar cita
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
        res.json({ message: 'Cita eliminada' });
    } catch (error) {
        console.error('Error eliminando cita:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// ===== CONSULTAS AVANZADAS =====

// Citas por doctor y fecha
app.get('/api/queries/appointments-by-doctor', async (req, res) => {
    try {
        const { doctorId, startDate, endDate } = req.query;
        const result = await pool.query(`
            SELECT a.*, p.name as patient_name, d.name as doctor_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            WHERE d.id = $1 AND a.appointment_date BETWEEN $2 AND $3
            ORDER BY a.appointment_date, a.appointment_time
        `, [doctorId, startDate, endDate]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en consulta:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Pacientes con muchas citas
app.get('/api/queries/patients-with-many-appointments', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.name, p.email, COUNT(a.id) as appointment_count
            FROM patients p
            JOIN appointments a ON p.id = a.patient_id
            GROUP BY p.id, p.name, p.email
            HAVING COUNT(a.id) > 3
            ORDER BY appointment_count DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en consulta:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// Ingresos por método de pago
app.get('/api/queries/income-by-payment', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await pool.query(`
            SELECT payment_method, SUM(amount) as total_income, COUNT(*) as appointment_count
            FROM appointments
            WHERE appointment_date BETWEEN $1 AND $2
            GROUP BY payment_method
            ORDER BY total_income DESC
        `, [startDate, endDate]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error en consulta:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// ===== CARGA DE CSV =====

// Configurar multer para archivos
const upload = multer({ dest: 'uploads/' });

// Cargar CSV
app.post('/api/upload-csv', upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }

        const results = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    // Insertar datos del CSV
                    for (const row of results) {
                        if (row.name && row.email) {
                            await pool.query(
                                'INSERT INTO patients (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
                                [row.name, row.email, row.phone || null]
                            );
                        }
                    }
                    
                    // Limpiar archivo temporal
                    fs.unlinkSync(req.file.path);
                    
                    res.json({ message: `${results.length} registros procesados` });
                } catch (error) {
                    console.error('Error procesando CSV:', error);
                    res.status(500).json({ message: 'Error procesando CSV' });
                }
            });
    } catch (error) {
        console.error('Error subiendo CSV:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// ===== RUTA PRINCIPAL =====
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../frontend/index.html');
});

// ===== INICIAR SERVIDOR =====
async function iniciarServidor() {
    try {
        // Crear tablas y datos de ejemplo
        await crearTablas();
        await insertarDatosEjemplo();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor CrudClinic ejecutándose en http://localhost:${PORT}`);
            console.log(`👤 Usuario admin: admin / admin123`);
            console.log(`📁 Frontend: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
    }
}

iniciarServidor();
