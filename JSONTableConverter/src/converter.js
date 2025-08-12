/**
 * JSON to Table Converter - Función Simple
 * Convierte cualquier JSON a tabla HTML con Bootstrap
 * 
 * @author CrudClinic Team
 * @version 1.0.0
 */

/**
 * Función que convierte JSON a tabla HTML
 * @param {Object|Array} jsonData - Los datos JSON
 * @returns {string} HTML de la tabla
 */
function convertJsonToTable(jsonData) {
    try {
        // Si es un array, usarlo directamente
        let data = jsonData;
        if (Array.isArray(jsonData)) {
            data = jsonData;
        } else {
            // Si es un objeto, buscar la primera propiedad que sea un array
            for (const key in jsonData) {
                if (Array.isArray(jsonData[key])) {
                    data = jsonData[key];
                    break;
                }
            }
        }

        // Si no hay datos, mostrar mensaje
        if (!data || data.length === 0) {
            return '<div class="alert alert-info">No hay datos para mostrar</div>';
        }

        // Obtener las columnas del primer elemento
        const columns = Object.keys(data[0]);
        
        // Crear encabezados
        let headers = '';
        columns.forEach(column => {
            headers += `<th class="table-primary text-white">${column}</th>`;
        });

        // Crear filas
        let rows = '';
        data.forEach((item, index) => {
            let cells = '';
            columns.forEach(column => {
                const value = item[column];
                let cellContent = '';
                
                // Formatear el valor según su tipo
                if (value === null || value === undefined) {
                    cellContent = '<span class="text-muted">-</span>';
                } else if (typeof value === 'boolean') {
                    const badgeClass = value ? 'success' : 'secondary';
                    const text = value ? 'Sí' : 'No';
                    cellContent = `<span class="badge bg-${badgeClass}">${text}</span>`;
                } else if (typeof value === 'number') {
                    cellContent = `<span class="text-primary">${value}</span>`;
                } else if (typeof value === 'string') {
                    // Si parece ser un email
                    if (value.includes('@') && value.includes('.')) {
                        cellContent = `<a href="mailto:${value}" class="text-primary">${value}</a>`;
                    }
                    // Si parece ser una URL
                    else if (value.startsWith('http')) {
                        cellContent = `<a href="${value}" target="_blank" class="text-info">${value}</a>`;
                    }
                    // Texto normal
                    else {
                        cellContent = value;
                    }
                } else if (Array.isArray(value)) {
                    cellContent = `<span class="badge bg-secondary">${value.length} items</span>`;
                } else {
                    cellContent = JSON.stringify(value);
                }
                
                cells += `<td>${cellContent}</td>`;
            });
            
            // Alternar colores de filas
            const rowClass = index % 2 === 0 ? 'table-light' : 'table-white';
            rows += `<tr class="${rowClass}">${cells}</tr>`;
        });

        // Crear la tabla completa
        const table = `
            <div class="table-responsive">
                <table class="table table-hover table-striped">
                    <thead>
                        <tr>
                            ${headers}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
            <div class="mt-3 text-muted">
                <small>Total: ${data.length} registros, ${columns.length} columnas</small>
            </div>
        `;

        return table;

    } catch (error) {
        return `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
}

// Exportar la función
module.exports = { convertJsonToTable };
