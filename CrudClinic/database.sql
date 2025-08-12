-- CrudClinic - PostgreSQL schema con comentarios por bloques

-- 1) Tabla de usuarios para login básico
--    - username único
--    - password_hash almacenado con bcrypt (nunca texto plano)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2) Tabla de pacientes
--    - email único para evitar duplicados
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3) Tabla de doctores
--    - combinación única (name, specialty) para evitar duplicados
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  specialty VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(name, specialty)
);

-- 4) Tabla de citas (appointments)
--    - FKs a patients y doctors
--    - status y payment_method limitados por CHECK
--    - amount para consultas de ingresos
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  doctor_id INT NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(30) NOT NULL CHECK (status IN ('programada', 'completada', 'cancelada')),
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('efectivo', 'tarjeta', 'seguro')),
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para acelerar consultas por FK y fecha
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- Datos de ejemplo mínimos para probar
INSERT INTO patients (name, email, phone) VALUES
('Juan Pérez', 'juan.perez@example.com', '3001112233')
ON CONFLICT (email) DO NOTHING;

INSERT INTO doctors (name, specialty) VALUES
('Dra. Andrea Ortiz', 'Cardiología')
ON CONFLICT (name, specialty) DO NOTHING;

-- Cita de ejemplo (asumiendo IDs 1)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount)
VALUES (1, 1, '2025-08-15', '09:00', 'programada', 'efectivo', 120.00)
ON CONFLICT DO NOTHING;


