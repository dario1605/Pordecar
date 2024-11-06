const prices = {
    'paleta': 1,   //Pulpa Termera
    'palomita': 1,
    'bola-lomo': 1,
    'cuadrada': 1,
    'nalga': 1,
    'peceto': 1,
    'cuadril': 1,
    'colita-cuadril': 1,
    'tapa-cuadril': 1,
    'lomo': 1,
    'tortuguita': 1,
    'puchero': 1,          // Economicos Ternera
    'osobuco': 1,
    'aguja': 1,
    'falda': 1,
    'bocado-fino': 1,
    'bocado-ancho': 1,
    'costeleta-redonda': 1,
    'costeleta-ancha': 1,
    'molida-comun': 1,
    'molida-especial': 1,
    'costilla-ternera': 1, //Asado Ternera
    'matambre-ternera': 1,
    'vacio-ternera': 1,
    'entraña-costilla': 1,
    'bife-chorizo': 1,
    'ojo-de-bife': 1,
    'tapa-asado': 1,
    'tapa-nalga': 1,
    'punta-espalda': 1,
    'pierna-ternera': 1, //Por pieza Ternera
    'paleta-ternera-entera': 1,
    'bocado-a-f-p': 1,
    'carre-ternera': 1,
    'costillar-ternera': 1,
    'brazuelo-ternera': 1,
    'cogotera-ternera': 1,
    'paleta-cerdo': 1,     //Cerdo
    'paleta-cerdo-sc': 1,
    'pierna-cerdo': 1,
    'pierna-cerdo-sc': 1,
    'pechito-cerdo': 1,
    'carre-cerdo': 1,
    'bondiola-cerdo': 1,
    'bondiola-cerdo-ch': 1,
    'osobuco-cerdo': 1,
    'solomillo': 1,
    'matambre-cerdo': 1,
    'pulpa-cerdo': 1,
    'pollo': 1,          //Pollo
    'pata-muslo': 1,
    'pechuga-sh': 1,
    'pechuga-ch': 1,
    'alitas': 1,
    'menudos': 1,
    'chorizo-cerdo-clasico': 1, //Embutidos
    'chorizo-cerdo-premium': 1,
    'chorizo-criollo': 1,
    'morcilla-verdeo': 1,
    'morcilla-vasca': 1,
    'salamin': 1,
    'chorizo-colorado': 1
};

// Función para cambiar los kilos
function changeKilos(corte, amount) {
    const input = document.getElementById(`kilos-${corte}`);
    let kilos = parseInt(input.value, 10) || 0;
    kilos += amount;
    input.value = Math.max(kilos, 0); // Prevenir valores negativos
    calculateTotal(corte);
}

// Función para calcular el total
function calculateTotal(corte) {
    const input = document.getElementById(`kilos-${corte}`);
    const kilos = parseInt(input.value, 10) || 0;
    const totalElement = document.getElementById(`total-${corte}`);
    const price = prices[corte] || 0;
    totalElement.textContent = kilos * price;
}

// Función para guardar los datos
function saveData() {
    const data = {};
    const rows = document.querySelectorAll('#table-body tr');
    rows.forEach(row => {
        const corte = row.getAttribute('data-corte');
        const kilos = parseInt(document.getElementById(`kilos-${corte}`).value, 10) || 0;
        const totalElement = document.getElementById(`total-${corte}`);
        const price = prices[corte] || 0;
        const total = parseInt(totalElement.textContent, 10) || 0;

        // Recuperar datos almacenados en localStorage
        const storedData = JSON.parse(localStorage.getItem('stockData')) || {};
        if (!storedData[corte]) {
            storedData[corte] = { total: 0 };
        }

        // Actualizar el total acumulado en localStorage
        storedData[corte].total += kilos * price;
        data[corte] = {
            kilos: kilos,
            total: storedData[corte].total
        };

        // Mostrar el total acumulado en la tabla
        totalElement.textContent = storedData[corte].total;
    });

    // Guardar datos en localStorage
    localStorage.setItem('stockData', JSON.stringify(data));

    // Mostrar el mensaje de confirmación
    showConfirmationMessage("Kilos Cargados");
}

// Función para mostrar el mensaje de confirmación
function showConfirmationMessage(message) {
    const messageElement = document.getElementById('confirmation-message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

// Función para descargar el archivo de texto
function downloadTextFile() {
    const rows = document.querySelectorAll('#table-body tr');
    let textContent = 'Cortes\tKilos\tTotal\n';
    rows.forEach(row => {
        const corte = row.getAttribute('data-corte');
        const kilos = document.getElementById(`kilos-${corte}`).value || '0';
        const total = document.getElementById(`total-${corte}`).textContent || '0';
        textContent += `${corte}\t${kilos}\t${total}\n`;
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_economicos.txt';
    a.click();
    URL.revokeObjectURL(url);

    // Reiniciar los datos después de descargar
    resetAll();
}

// Función para reiniciar los datos
function resetAll() {
    localStorage.removeItem('stockData');
    resetKilos();
    showConfirmationMessage("Datos Eliminados"); // Mostrar mensaje de eliminación
}

// Función para reiniciar los kilos
function resetKilos() {
    const rows = document.querySelectorAll('#table-body tr');
    rows.forEach(row => {
        const corte = row.getAttribute('data-corte');
        document.getElementById(`kilos-${corte}`).value = 0;
        document.getElementById(`total-${corte}`).textContent = 0; // Resetea el total a 0
    });
}

// Inicializar los totales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('#table-body tr');
    rows.forEach(row => {
        const corte = row.getAttribute('data-corte');
        const storedData = JSON.parse(localStorage.getItem('stockData')) || {};
        const total = (storedData[corte] && storedData[corte].total) || 0;
        document.getElementById(`total-${corte}`).textContent = total;

        const input = document.getElementById(`kilos-${corte}`);
        input.addEventListener('input', () => calculateTotal(corte));
    });
});
