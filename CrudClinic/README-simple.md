# 🏥 CrudClinic - Sistema Súper Simple

Sistema de citas médicas **todo en un solo archivo** para principiantes.

## ✨ ¿Qué hace?

- ✅ **Login con roles** (admin/user)
- ✅ **CRUD de pacientes** (crear, leer, actualizar, eliminar)
- ✅ **CRUD de doctores** (crear, leer, actualizar, eliminar)
- ✅ **CRUD de citas** (crear, leer, actualizar, eliminar)
- ✅ **Consultas avanzadas** (por doctor, ingresos, etc.)
- ✅ **Carga de CSV** para pacientes
- ✅ **Base de datos PostgreSQL** automática

## 🚀 Instalación Súper Rápida

### 1. Instalar PostgreSQL

- Descarga e instala PostgreSQL desde [postgresql.org](https://postgresql.org)
- Crea una base de datos llamada `crudclinic`

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Ejecutar

```bash
npm start
```

### 4. Abrir en navegador

- Ve a: `http://localhost:3000`
- Usuario: `admin` / Contraseña: `admin123`

## 📁 Estructura Súper Simple

```
CrudClinic/
├── backend/
│   ├── app-simple.js     # TODO EL BACKEND EN UN ARCHIVO
│   └── package-simple.json
├── frontend/
│   └── index-simple.html # TODO EL FRONTEND EN UN ARCHIVO
└── README-simple.md
```

## 🔐 Usuarios por Defecto

- **Admin**: `admin` / `admin123`
- **Rol**: Puede hacer todo

## 📊 Base de Datos

El sistema crea automáticamente:

- **users** - Usuarios y roles
- **patients** - Pacientes
- **doctors** - Doctores
- **appointments** - Citas

## 🎯 Funcionalidades

### 📅 Citas

- Crear, editar, eliminar citas
- Asignar paciente y doctor
- Estados: programada, completada, cancelada
- Métodos de pago: efectivo, tarjeta, seguro

### 👥 Pacientes

- CRUD completo
- Carga masiva desde CSV
- Validación de email único

### 👨‍⚕️ Doctores

- CRUD completo
- Especialidades

### 📊 Consultas

- Citas por doctor y fecha
- Ingresos por método de pago
- Pacientes con muchas citas

## 📁 Cargar CSV

Formato del archivo CSV:

```csv
name,email,phone
Juan Pérez,juan@email.com,123-456-7890
Ana García,ana@email.com,098-765-4321
```

## 🛠️ Tecnologías

- **Backend**: Node.js + Express (1 archivo)
- **Base de datos**: PostgreSQL
- **Frontend**: HTML + Bootstrap + JavaScript (1 archivo)
- **Autenticación**: bcrypt para contraseñas

## 🎉 ¡Listo!

- **Backend**: `app-simple.js` - Todo en un archivo
- **Frontend**: `index-simple.html` - Todo en un archivo
- **Base de datos**: Se crea automáticamente
- **Usuario demo**: admin/admin123

¡Súper simple para principiantes! 🚀
