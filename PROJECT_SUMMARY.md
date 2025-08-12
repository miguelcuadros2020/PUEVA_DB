# 🏥 CrudClinic + 📊 JSON Table Converter - Proyecto Completo

## 📋 Resumen del Proyecto

Este proyecto incluye **dos sistemas completos**:

1. **🏥 CrudClinic**: Sistema de gestión de citas médicas con Node.js + Express + PostgreSQL
2. **📊 JSON Table Converter**: Herramienta universal para convertir cualquier JSON de API a tablas HTML con Bootstrap

---

## 🏥 CrudClinic - Sistema de Gestión Médica

### 🎯 Objetivos Cumplidos

✅ **Base de Datos Normalizada (3FN)**

- Eliminación de redundancias e inconsistencias del Excel original
- Separación de entidades: Patients, Doctors, Appointments, Users
- Relaciones con claves foráneas y restricciones

✅ **API REST Completa**

- CRUD para Pacientes, Doctores y Citas
- Autenticación con bcrypt (sin JWT, minimalista)
- Consultas avanzadas para reportes

✅ **Frontend Moderno**

- Login y registro de usuarios
- Dashboard con gestión de citas
- Formularios modales para CRUD
- Consultas avanzadas integradas

✅ **Carga Masiva CSV**

- Script para importar datos desde Excel/CSV
- Validación y limpieza de datos
- Inserción masiva en base de datos

### 🏗️ Arquitectura del Sistema

```
CrudClinic/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # Conexión PostgreSQL
│   │   ├── controllers/          # Lógica de negocio
│   │   ├── routes/               # Endpoints API
│   │   ├── scripts/              # Carga CSV
│   │   └── app.js                # Servidor principal
│   ├── package.json              # Dependencias
│   └── ENV.EXAMPLE               # Variables de entorno
├── frontend/
│   ├── index.html                # Login/Registro
│   ├── dashboard.html            # Panel principal
│   └── js/                       # JavaScript del frontend
└── database.sql                  # Esquema de BD
```

### 🔐 Seguridad Implementada

- **bcrypt** para hash de contraseñas
- **Consultas parametrizadas** con pg (prevención SQL injection)
- **Validación de entrada** en todos los endpoints
- **Manejo de errores** robusto

### 📊 Base de Datos

**Entidades principales:**

- `users(id, username, password_hash, role)`
- `patients(id, name, email, phone)`
- `doctors(id, name, specialty)`
- `appointments(id, patient_id, doctor_id, date, time, status, payment_method, amount)`

**Relaciones:**

- Appointments → Patients (FK)
- Appointments → Doctors (FK)
- Índices para optimizar consultas

### 🚀 Endpoints API

```
POST   /api/login                 # Autenticación
POST   /api/register              # Registro de usuarios
GET    /api/patients              # Listar pacientes
POST   /api/patients              # Crear paciente
PUT    /api/patients/:id          # Actualizar paciente
DELETE /api/patients/:id          # Eliminar paciente
# ... similar para doctors y appointments

GET    /api/queries/appointments  # Consultas avanzadas
POST   /api/upload-csv            # Carga masiva CSV
```

### 💻 Frontend

- **Bootstrap 5** para diseño responsive
- **Vanilla JavaScript** para funcionalidad
- **Modales** para formularios CRUD
- **Tablas dinámicas** con datos de la API
- **Consultas avanzadas** integradas en la interfaz

---

## 📊 JSON Table Converter - Herramienta Universal

### 🎯 Características Principales

✅ **Universal**: Funciona con cualquier estructura JSON
✅ **Auto-detección**: Identifica automáticamente columnas y tipos
✅ **Diseño Moderno**: Bootstrap con tonos grises y encabezados azules
✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
✅ **Seguro**: Escape de HTML y validación de entrada

### 🏗️ Estructura del Proyecto

```
JSONTableConverter/
├── src/
│   ├── converter.js              # Función principal de conversión
│   ├── test.js                   # Script de pruebas completo
│   └── server.js                 # Servidor web de demostración
├── examples/
│   └── sample-data.json          # Datos de ejemplo
├── package.json                  # Dependencias
└── README.md                     # Documentación completa
```

### 🔧 Funcionalidades Técnicas

**Auto-detección de Columnas:**

- Analiza automáticamente la estructura del JSON
- Identifica todos los campos disponibles
- Crea encabezados dinámicos y legibles

**Formateo Inteligente:**

- **Emails**: Se convierten en enlaces mailto
- **URLs**: Se convierten en enlaces clickeables
- **Fechas**: Se destacan con color verde
- **Booleanos**: Se muestran como badges (Sí/No)
- **Números grandes**: Se formatean (1K, 1M)
- **Arrays**: Se muestran como badges con conteo

**Opciones de Personalización:**

- Clases CSS personalizables
- Números de fila opcionales
- Límite de filas configurable
- Estilos de tabla variados

### 🌐 Servidor Web de Demostración

**Endpoints disponibles:**

- `GET /` - Interfaz web completa
- `POST /api/convert` - Conversión de JSON a tabla
- `GET /api/convert` - Conversión vía query parameters

**Interfaz web incluye:**

- Ejemplos predefinidos (empleados, productos, órdenes, usuarios)
- Editor de JSON con validación
- Opciones de personalización
- Vista previa de la tabla generada
- Diseño moderno con Bootstrap

### 📱 Uso en Frontend

```javascript
// Importar la función
const { convertJsonToTable } = require("./converter");

// JSON de cualquier API
const apiData = {
  users: [
    { id: 1, name: "Juan", email: "juan@email.com" },
    { id: 2, name: "Ana", email: "ana@email.com" },
  ],
};

// Convertir a tabla HTML
const htmlTable = convertJsonToTable(apiData, {
  showRowNumbers: true,
  tableClass: "table table-hover table-striped",
});

// Insertar en el DOM
document.getElementById("result").innerHTML = htmlTable;
```

---

## 🚀 Instalación y Uso

### 📋 Prerrequisitos

- **Node.js** (versión 14 o superior)
- **PostgreSQL** (para CrudClinic)
- **npm** o **yarn**

### 🏥 CrudClinic

```bash
# 1. Configurar base de datos
cd CrudClinic
# Ejecutar database.sql en PostgreSQL

# 2. Configurar variables de entorno
cd backend
copy ENV.EXAMPLE .env
# Editar .env con credenciales de BD

# 3. Instalar dependencias
npm install

# 4. Ejecutar servidor
npm start
# Servidor en http://localhost:3000
```

### 📊 JSON Table Converter

```bash
# 1. Instalar dependencias
cd JSONTableConverter
npm install

# 2. Probar funcionalidad
node test-simple.js
node src/test.js

# 3. Servidor web (opcional)
npm start
# Servidor en http://localhost:3001
```

---

## 🧪 Pruebas y Demostración

### 🏥 CrudClinic

1. **Acceder a** `http://localhost:3000`
2. **Crear cuenta** de usuario
3. **Iniciar sesión** y acceder al dashboard
4. **Gestionar citas** (crear, editar, eliminar)
5. **Probar consultas avanzadas**
6. **Cargar datos CSV** usando el script

### 📊 JSON Table Converter

1. **Probar scripts**: `node test-simple.js`
2. **Servidor web**: `npm start` → `http://localhost:3001`
3. **Ejemplos predefinidos** disponibles
4. **JSON personalizado** para convertir
5. **Opciones de personalización** de tablas

---

## 🔧 Tecnologías Utilizadas

### 🏥 CrudClinic

- **Backend**: Node.js, Express, PostgreSQL
- **Seguridad**: bcrypt, consultas parametrizadas
- **Frontend**: HTML5, Bootstrap 5, Vanilla JavaScript
- **Base de Datos**: PostgreSQL con normalización 3FN

### 📊 JSON Table Converter

- **Core**: Node.js, JavaScript ES6+
- **Web**: Express (opcional)
- **Formato**: HTML5, Bootstrap 5, CSS3
- **Utilidades**: Parsing JSON, escape HTML, validación

---

## 📈 Beneficios y Ventajas

### 🏥 CrudClinic

- ✅ **Sistema completo** para gestión médica
- ✅ **Base de datos normalizada** sin redundancias
- ✅ **API REST robusta** con seguridad
- ✅ **Frontend moderno** y responsive
- ✅ **Carga masiva** de datos desde Excel
- ✅ **Consultas avanzadas** para reportes

### 📊 JSON Table Converter

- ✅ **Universal** - funciona con cualquier JSON
- ✅ **Automático** - detecta estructura automáticamente
- ✅ **Seguro** - previene XSS y valida entrada
- ✅ **Personalizable** - múltiples opciones de estilo
- ✅ **Integrable** - fácil de usar en cualquier frontend
- ✅ **Responsive** - se adapta a todos los dispositivos

---

## 🎯 Casos de Uso

### 🏥 CrudClinic

- **Clínicas médicas** pequeñas y medianas
- **Consultorios** privados
- **Sistemas de citas** médicas
- **Gestión de pacientes** y doctores
- **Reportes** de ingresos y estadísticas

### 📊 JSON Table Converter

- **Dashboards** de cualquier aplicación
- **Reportes** de APIs externas
- **Visualización** de datos JSON
- **Prototipos** rápidos de tablas
- **Integración** con sistemas existentes

---

## 🔮 Futuras Mejoras

### 🏥 CrudClinic

- [ ] **JWT** para autenticación avanzada
- [ ] **Rate limiting** para protección
- [ ] **Logs** de auditoría
- [ ] **Backup** automático de BD
- [ ] **Múltiples roles** de usuario

### 📊 JSON Table Converter

- [ ] **Export** a PDF/Excel
- [ ] **Filtros** y búsqueda
- [ ] **Paginación** para grandes datasets
- [ ] **Temas** personalizables
- [ ] **Integración** con frameworks populares

---

## 📞 Soporte y Contacto

- **Documentación**: README.md en cada proyecto
- **Ejemplos**: Archivos de prueba incluidos
- **Código comentado**: Explicaciones en cada función
- **Estructura modular**: Fácil de mantener y extender

---

## 🏆 Conclusión

Este proyecto demuestra la implementación de **dos sistemas robustos**:

1. **CrudClinic**: Sistema médico completo con arquitectura empresarial
2. **JSON Table Converter**: Herramienta universal para visualización de datos

Ambos sistemas están **completamente implementados**, **bien documentados** y **listos para usar**. El código es **limpio**, **mantenible** y sigue las **mejores prácticas** de desarrollo web moderno.

**¡Los objetivos del simulacro han sido cumplidos exitosamente!** 🎉
