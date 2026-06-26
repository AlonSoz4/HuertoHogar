// ==========================================================================
/* INTERACTIVIDAD DEL MAPA DE SUCURSALES (PÁGINA NOSOTROS) */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById("interactive-store-map");
    const buttons = document.querySelectorAll(".city-btn");

    // Validamos que los elementos existan en la página actual (evita errores en el Home o Productos)
    if (mapContainer && buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                // 1. Quitar la clase activa de todos los botones y ponérsela al clickeado
                buttons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                // 2. Obtener el nombre de la ciudad del atributo data
                const targetLocation = button.getAttribute("data-location");
                
                // 3. Codificar la ubicación para la URL de Google Maps de forma segura
                const encodedLocation = encodeURIComponent(targetLocation);
                
                // 4. Actualizar el origen del iframe con la nueva ubicación y un zoom alto (z=14)
                mapContainer.src = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
            });
        });
    }
});