# JSON to Table Converter

Función simple que convierte JSON a tablas HTML con Bootstrap.

## ¿Qué recibe?

La función `convertJsonToTable` recibe cualquier formato de JSON:

```javascript
// Array simple
[
    {"id": 1, "nombre": "Juan", "email": "juan@email.com"},
    {"id": 2, "nombre": "Ana", "email": "ana@email.com"}
]

// Objeto con array
{
    "usuarios": [
        {"id": 1, "nombre": "Juan", "activo": true},
        {"id": 2, "nombre": "Ana", "activo": false}
    ]
}

// Objeto simple
{"id": 1, "nombre": "Juan", "edad": 25}
```

## ¿Qué devuelve?

Devuelve HTML de una tabla con Bootstrap:

```html
<div class="table-responsive">
  <table class="table table-hover table-striped">
    <thead>
      <tr>
        <th class="table-primary text-white">id</th>
        <th class="table-primary text-white">nombre</th>
        <th class="table-primary text-white">email</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-light">
        <td>1</td>
        <td>Juan</td>
        <td>
          <a href="mailto:juan@email.com" class="text-primary"
            >juan@email.com</a
          >
        </td>
      </tr>
      <tr class="table-white">
        <td>2</td>
        <td>Ana</td>
        <td>
          <a href="mailto:ana@email.com" class="text-primary">ana@email.com</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<div class="mt-3 text-muted">
  <small>Total: 2 registros, 3 columnas</small>
</div>
```

## Uso

```javascript
const { convertJsonToTable } = require('./src/converter');

const miJSON = [...];
const tablaHTML = convertJsonToTable(miJSON);
```

## Formulario de Edición Dinámico

También incluimos un formulario que se adapta automáticamente a cualquier cantidad de datos:

- **`formulario-edicion.html`** - Formulario base para tu proyecto
- **`ejemplo-formulario.html`** - Ejemplo funcionando con datos simulados

### Características del Formulario:

- ✅ **Búsqueda por ID** - Ingresa el ID y busca el registro
- ✅ **Campos dinámicos** - Se adapta automáticamente a la cantidad de datos
- ✅ **Tipos inteligentes** - Detecta automáticamente el tipo de campo (texto, número, checkbox, etc.)
- ✅ **Preview JSON** - Muestra en tiempo real el JSON que se enviará
- ✅ **Axios integrado** - Listo para conectar con tu backend
- ✅ **Validación de cambios** - Solo envía si hay modificaciones

### Para usar en tu proyecto:

1. Copia `formulario-edicion.html` a tu proyecto
2. Cambia las URLs de Axios por tu backend:
   ```javascript
   // Cambia esto:
   const response = await axios.get(`/api/registros/${id}`);
   const response = await axios.put(
     `/api/registros/${registroActual.id}`,
     datosActualizados
   );
   ```
3. ¡Listo! El formulario se adaptará automáticamente a tus datos

¡Solo copia la función y úsala! 🚀
