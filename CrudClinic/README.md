## CrudClinic

Sistema simple para gestionar citas médicas con Node.js + Express + PostgreSQL, frontend HTML+Bootstrap, carga masiva CSV y consultas avanzadas. Incluye comentarios en el código explicando los bloques principales.

### Normalización (resumen)

- 1FN: campos atómicos, sin grupos repetidos; separar “Paciente/Doctor” en columnas y tablas.
- 2FN: separar datos de paciente/doctor de la cita; `appointments` referencia `patients` y `doctors`.
- 3FN: especialidad depende del doctor, no de la cita; evitar dependencias transitivas.

### Modelo ER (texto)

- `patients(id, name, email, phone)`
- `doctors(id, name, specialty)`
- `appointments(id, patient_id, doctor_id, appointment_date, appointment_time, status, payment_method, amount)`
- `users(id, username, password_hash, role)`

Relaciones:

- `appointments.patient_id → patients.id`
- `appointments.doctor_id → doctors.id`

### SQL

Ver `database.sql` para DDL e inserts de ejemplo.

### Backend

- Estructura modular en `backend/src`:
  - `config/db.js`: Pool de PostgreSQL con `pg` y `.env`
  - `controllers/*`: lógica CRUD, login y queries
  - `routes/*`: endpoints REST
  - `scripts/load-csv.js`: carga CSV por línea de comando
- Seguridad:
  - Hash de contraseñas con `bcrypt`
  - Consultas preparadas con placeholders `$1..$n` contra SQL injection
- Dependencias: `express`, `pg`, `bcrypt`, `dotenv`, `csv-parser`, `multer`

### Endpoints (base /api)

- Auth:
  - POST `/register` body: `{ username, password }`
  - POST `/login` body: `{ username, password }` → `{ success, user }` (sin JWT)
- Patients:
  - GET `/patients`, GET `/patients/:id`, POST `/patients`, PUT `/patients/:id`, DELETE `/patients/:id`
- Doctors:
  - GET `/doctors`, GET `/doctors/:id`, POST `/doctors`, PUT `/doctors/:id`, DELETE `/doctors/:id`
- Appointments:
  - GET `/appointments`, GET `/appointments/:id`, POST `/appointments`, PUT `/appointments/:id`, DELETE `/appointments/:id`
- Queries:
  - GET `/queries/appointments`
  - GET `/queries/appointments-by-doctor?doctorId=1&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
  - GET `/queries/patients-with-many-appointments`
  - GET `/queries/doctors-appointments-last-month`
  - GET `/queries/income-by-payment?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- CSV (opcional):
  - POST `/upload-csv` con `multipart/form-data` campo `file` (cabeceras: `patient_name,patient_email,patient_phone,doctor_name,doctor_specialty,appointment_date,appointment_time,status,payment_method,amount`)

### Frontend

- `index.html`: login y registro simples
- `dashboard.html`: tabla de citas, formulario (modal) para crear/editar y consultas avanzadas
- Textos en español, variables/código en inglés

### Instalación y ejecución

1. PostgreSQL:

- Crear BD (por ejemplo `crudclinic`) y ejecutar `database.sql`.

2. Backend:

```bash
cd backend
copy ENV.EXAMPLE .env  # En Windows PowerShell/CMD. Ajustar credenciales
npm install
npm start
```

El servidor queda en `http://localhost:3000`.

3. Frontend:

- Servido estáticamente por Express: abrir `http://localhost:3000/` (login) y `http://localhost:3000/dashboard.html` (panel).

### Carga CSV (manual)

- Preparar CSV con cabeceras: `patient_name,patient_email,patient_phone,doctor_name,doctor_specialty,appointment_date,appointment_time,status,payment_method,amount`
- Ejecutar:

```bash
cd backend
node src/scripts/load-csv.js --file=./data/appointments.csv
```

### Trabajo colaborativo

- Persona A: Diseño de BD y `database.sql`
- Persona B: Backend (controladores/rutas)
- Persona C: Frontend HTML/Bootstrap
- Persona D: Scripts CSV y pruebas de consultas

### Cómo cumple objetivos

- Diseño de BD normalizado a 3FN con claves primarias/foráneas, UNIQUE y tipos apropiados.
- API REST modular con CRUD de pacientes, doctores y citas.
- Autenticación básica con `bcrypt` (sin JWT, minimalista).
- Carga masiva CSV con consultas parametrizadas.
- Consultas avanzadas expuestas como endpoints.
- Frontend simple en HTML + Bootstrap consumiendo la API.
- Documentación clara con pasos de instalación y uso.
