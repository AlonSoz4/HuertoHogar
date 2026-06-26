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

// ==========================================================================
/* GESTIÓN DINÁMICA DEL MANTENEDOR DE PRODUCTOS (productosAdmin.html) */
// ==========================================================================

// 1. Catálogo inicial basado exactamente en el documento oficial "Forma A"
const initialProducts = [
    { code: "FR001", category: "Frutas Frescas", name: "Manzanas Fuji", price: 1200, stock: 150 },
    { code: "FR002", category: "Frutas Frescas", name: "Naranjas Valencia", price: 1000, stock: 200 },
    { code: "FR003", category: "Frutas Frescas", name: "Plátanos Cavendish", price: 800, stock: 250 },
    { code: "VR001", category: "Verduras Orgánicas", name: "Zanahorias Orgánicas", price: 900, stock: 100 },
    { code: "VR002", category: "Verduras Orgánicas", name: "Espinacas Frescas (500g)", price: 700, stock: 80 },
    { code: "VR003", category: "Verduras Orgánicas", name: "Pimientos Tricolores", price: 1500, stock: 120 },
    { code: "PO001", category: "Productos Orgánicos", name: "Miel Orgánica (500g)", price: 5000, stock: 50 },
    { code: "PO003", category: "Productos Orgánicos", name: "Quinua Orgánica", price: 2400, stock: 90 },
    { code: "PL001", category: "Productos Lácteos", name: "Leche Entera", price: 1100, stock: 110 }
];

// 2. Función para cargar o inicializar el LocalStorage de manera segura
function getStoredProducts() {
    const stored = localStorage.getItem("huerto_products_catalog");
    if (!stored) {
        // Si no existe en LocalStorage, montamos los 9 productos base por primera vez
        localStorage.setItem("huerto_products_catalog", JSON.stringify(initialProducts));
        return initialProducts;
    }
    return JSON.stringify(stored) ? JSON.parse(stored) : initialProducts;
}

// 3. Función para renderizar dinámicamente la tabla en el panel del Administrador
function renderAdminProductsTable() {
    const tableBody = document.getElementById("admin-products-table-body");
    if (!tableBody) return; // Evita errores si se ejecuta en páginas de la tienda

    const products = getStoredProducts();
    tableBody.innerHTML = ""; // Limpiamos la tabla para refrescar

    if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No hay productos en el inventario.</td></tr>`;
        return;
    }

    products.forEach(product => {
        const row = document.createElement("tr");

        // Asignamos estilos de colores de badges según la categoría de la pauta
        let catClass = "badge-cat";
        if (product.category.includes("Verduras")) catClass += " badge-green";
        if (product.category.includes("Orgánicos")) catClass += " badge-brown";
        if (product.category.includes("Lácteos")) catClass += " badge-blue";

        row.innerHTML = `
            <td class="text-bold">${product.code}</td>
            <td><span class="${catClass}">${product.category}</span></td>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString('es-CL')} CLP</td>
            <td>${product.stock}</td>
            <td>
                <div class="table-actions-group">
                    <a href="editarProducto.html?code=${product.code}" class="btn-table-edit" title="Editar">✏️</a>
                    <button type="button" class="btn-table-delete" onclick="deleteProductFromAdmin('${product.code}')" title="Eliminar">🗑️</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 4. Función interactiva para eliminar un producto del arreglo de LocalStorage
window.deleteProductFromAdmin = (code) => {
    if (confirm(`¿Está seguro de que desea eliminar el producto con código ${code}?`)) {
        let products = getStoredProducts();
        // Filtramos el arreglo para remover el producto seleccionado
        products = products.filter(p => p.code !== code);
        
        // Guardamos el nuevo arreglo modificado en LocalStorage
        localStorage.setItem("huerto_products_catalog", JSON.stringify(products));
        
        // Refrescamos la tabla automáticamente en la pantalla
        renderAdminProductsTable();
    }
};

// Inicializamos la ejecución cuando la página termine de cargar
document.addEventListener("DOMContentLoaded", () => {
    renderAdminProductsTable();
});

// ==========================================================================
/* PROCESAMIENTO Y VALIDACIÓN DE NUEVOS PRODUCTOS (nuevoProducto.html) */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const addProductForm = document.getElementById("form-admin-add-product");

    if (addProductForm) {
        addProductForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Elementos
            const codeIn = document.getElementById("prod-code");
            const catIn = document.getElementById("prod-category");
            const nameIn = document.getElementById("prod-name");
            const priceIn = document.getElementById("prod-price");
            const stockIn = document.getElementById("prod-stock");
            const descIn = document.getElementById("prod-desc");

            // Contenedores de Error
            const errCode = document.getElementById("error-prod-code");
            const errCat = document.getElementById("error-prod-category");
            const errName = document.getElementById("error-prod-name");
            const errPrice = document.getElementById("error-prod-price");
            const errStock = document.getElementById("error-prod-stock");

            // Limpieza inicial
            [errCode, errCat, errName, errPrice, errStock].forEach(el => el.textContent = "");

            let isValid = true;
            const currentCatalog = getStoredProducts();

            // 1. Validación Código (Requerido, Min 3, Único)
            const codeVal = codeIn.value.trim().toUpperCase();
            if (!codeVal) {
                errCode.textContent = "El código es obligatorio.";
                isValid = false;
            } else if (codeVal.length < 3) {
                errCode.textContent = "Mínimo 3 caracteres.";
                isValid = false;
            } else if (currentCatalog.some(p => p.code === codeVal)) {
                errCode.textContent = "Este código ya está registrado.";
                isValid = false;
            }

            // 2. Validación Categoría
            if (!catIn.value) {
                errCat.textContent = "Debe seleccionar una categoría.";
                isValid = false;
            }

            // 3. Validación Nombre (Requerido, Max 100)
            const nameVal = nameIn.value.trim();
            if (!nameVal) {
                errName.textContent = "El nombre es obligatorio.";
                isValid = false;
            }

            // 4. Validación Precio (Requerido, >= 0)
            const priceVal = parseFloat(priceIn.value);
            if (isNaN(priceVal) || priceVal < 0) {
                errPrice.textContent = "Precio inválido (Mínimo 0).";
                isValid = false;
            }

            // 5. Validación Stock (Requerido, Entero, >= 0)
            const stockVal = parseInt(stockIn.value, 10);
            if (isNaN(stockVal) || stockVal < 0) {
                errStock.textContent = "Stock inválido (Mínimo 0).";
                isValid = false;
            }

            // Si pasa el filtro frontend, guardamos en LocalStorage
            if (isValid) {
                const newProduct = {
                    code: codeVal,
                    category: catIn.value,
                    name: nameVal,
                    price: priceVal,
                    stock: stockVal,
                    description: descIn.value.trim()
                };

                currentCatalog.push(newProduct);
                localStorage.setItem("huerto_products_catalog", JSON.stringify(currentCatalog));

                alert("¡Producto agregado exitosamente al catálogo!");
                window.location.href = "productosAdmin.html"; // Regresa al listado actualizado
            }
        });
    }
});

// ==========================================================================
/* EDICIÓN Y ACTUALIZACIÓN DE PRODUCTOS EXISTENTES (editarProducto.html) */
// ==========================================================================
function initEditProductPage() {
    const editForm = document.getElementById("form-admin-edit-product");
    if (!editForm) return; // Rompe la función si no estamos en editarProducto.html

    // 1. Rescatamos el parámetro 'code' desde la URL usando URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get("code");

    if (!productCode) {
        alert("Código de producto no especificado.");
        window.location.href = "productosAdmin.html";
        return;
    }

    // 2. Buscamos el producto en LocalStorage
    const catalog = getStoredProducts();
    const product = catalog.find(p => p.code === productCode);

    if (!product) {
        alert("El producto especificado no existe en el catálogo.");
        window.location.href = "productosAdmin.html";
        return;
    }

    // 3. Rellenamos los inputs con los valores actuales del producto
    document.getElementById("edit-form-title").textContent = `Modificar Producto: ${product.code}`;
    document.getElementById("edit-prod-code").value = product.code;
    document.getElementById("edit-prod-category").value = product.category;
    document.getElementById("edit-prod-name").value = product.name;
    document.getElementById("edit-prod-price").value = product.price;
    document.getElementById("edit-prod-stock").value = product.stock;
    document.getElementById("edit-prod-desc").value = product.description || "";

    // 4. Capturamos el evento Submit para guardar los cambios
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Inputs
        const nameIn = document.getElementById("edit-prod-name");
        const catIn = document.getElementById("edit-prod-category");
        const priceIn = document.getElementById("edit-prod-price");
        const stockIn = document.getElementById("edit-prod-stock");
        const descIn = document.getElementById("edit-prod-desc");

        // Errores
        const errName = document.getElementById("error-edit-name");
        const errCat = document.getElementById("error-edit-cat");
        const errPrice = document.getElementById("error-edit-price");
        const errStock = document.getElementById("error-edit-stock");

        // Limpieza de mensajes
        [errName, errCat, errPrice, errStock].forEach(el => el.textContent = "");

        let isValid = true;

        // Validaciones idénticas a la pauta
        if (!catIn.value) { errCat.textContent = "Debe seleccionar una categoría."; isValid = false; }
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; }
        
        const priceVal = parseFloat(priceIn.value);
        if (isNaN(priceVal) || priceVal < 0) { errPrice.textContent = "Precio inválido."; isValid = false; }
        
        const stockVal = parseInt(stockIn.value, 10);
        if (isNaN(stockVal) || stockVal < 0) { errStock.textContent = "Stock inválido."; isValid = false; }

        if (isValid) {
            // Actualizamos el objeto en el arreglo clonado
            product.category = catIn.value;
            product.name = nameIn.value.trim();
            product.price = priceVal;
            product.stock = stockVal;
            product.description = descIn.value.trim();

            // Guardamos el arreglo modificado completo en LocalStorage
            localStorage.setItem("huerto_products_catalog", JSON.stringify(catalog));

            alert("¡Producto actualizado exitosamente!");
            window.location.href = "productosAdmin.html"; // Redirige al listado general
        }
    });
}

// Aseguramos que la inicialización se gatille al cargar la ventana
document.addEventListener("DOMContentLoaded", () => {
    initEditProductPage();
});

// ==========================================================================
/* PROCESAMIENTO Y VALIDACIÓN DE NUEVOS USUARIOS (nuevoUsuario.html) */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const addUserForm = document.getElementById("form-admin-add-user");

    if (addUserForm) {
        addUserForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Elementos de entrada
            const runIn = document.getElementById("user-run");
            const roleIn = document.getElementById("user-role");
            const nameIn = document.getElementById("user-name");
            const lastnameIn = document.getElementById("user-lastname");
            const emailIn = document.getElementById("user-email");
            const regionIn = document.getElementById("user-region");
            const comunaIn = document.getElementById("user-comuna");
            const addressIn = document.getElementById("user-address");

            // Elementos de error
            const errRun = document.getElementById("error-user-run");
            const errRole = document.getElementById("error-user-role");
            const errName = document.getElementById("error-user-name");
            const errLastname = document.getElementById("error-user-lastname");
            const errEmail = document.getElementById("error-user-email");
            const errRegion = document.getElementById("error-user-region");
            const errComuna = document.getElementById("error-user-comuna");
            const errAddress = document.getElementById("error-user-address");

            // Limpieza de errores
            [errRun, errRole, errName, errLastname, errEmail, errRegion, errComuna, errAddress].forEach(el => el.textContent = "");

            let isValid = true;
            const currentUsers = getStoredUsers();

            // 1. Validación RUN (Requerido, largo 7-9, único)
            const runVal = runIn.value.trim().toUpperCase();
            if (!runVal) {
                errRun.textContent = "El RUN es obligatorio.";
                isValid = false;
            } else if (runVal.length < 7 || runVal.length > 9) {
                errRun.textContent = "Debe tener entre 7 y 9 caracteres.";
                isValid = false;
            } else if (currentUsers.some(u => u.run === runVal)) {
                errRun.textContent = "Este RUN ya está registrado en el sistema.";
                isValid = false;
            }

            // 2. Validación Perfil / Rol
            if (!roleIn.value) { errRole.textContent = "Seleccione un rol."; isValid = false; }

            // 3. Validación Nombre (Max 50) y Apellidos (Max 100)
            if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; }
            if (!lastnameIn.value.trim()) { errLastname.textContent = "El apellido es obligatorio."; isValid = false; }

            // 4. Validación Correo (Dominios INACAP o Gmail)
            const emailVal = emailIn.value.trim().toLowerCase();
            if (!emailVal) {
                errEmail.textContent = "El correo es obligatorio.";
                isValid = false;
            } else {
                const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
                if (!allowedDomains.test(emailVal)) {
                    errEmail.textContent = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                    isValid = false;
                }
            }

            // 5. Ubicación y Dirección (Max 300)
            if (!regionIn.value) { errRegion.textContent = "Región requerida."; isValid = false; }
            if (!comunaIn.value) { errComuna.textContent = "Comuna requerida."; isValid = false; }
            if (!addressIn.value.trim()) { errAddress.textContent = "La dirección es obligatoria."; isValid = false; }

            // Si todo está impecable, insertamos en LocalStorage
            if (isValid) {
                const newUser = {
                    run: runVal,
                    role: roleIn.value,
                    name: nameIn.value.trim(),
                    lastname: lastnameIn.value.trim(),
                    email: emailVal,
                    region: regionIn.value,
                    comuna: comunaIn.value,
                    address: addressIn.value.trim()
                };

                currentUsers.push(newUser);
                localStorage.setItem("huerto_users_catalog", JSON.stringify(currentUsers));

                alert("¡Usuario creado de manera exitosa!");
                window.location.href = "usuariosAdmin.html"; // Regresa a la tabla dinámicamente actualizada
            }
        });
    }
});

// ==========================================================================
/* EDICIÓN Y ACTUALIZACIÓN DE USUARIOS EXISTENTES ADMIN (editarUsuario.html) */
// ==========================================================================
function initEditUserPage() {
    const editForm = document.getElementById("form-admin-edit-user");
    if (!editForm) return; // Termina la función si no estamos en editarUsuario.html

    // 1. Rescatamos el parámetro 'run' desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const userRun = urlParams.get("run");

    if (!userRun) {
        alert("RUN de usuario no especificado.");
        window.location.href = "usuariosAdmin.html";
        return;
    }

    // 2. Buscamos el usuario en LocalStorage
    const usersList = getStoredUsers();
    const user = usersList.find(u => u.run === userRun);

    if (!user) {
        alert("El usuario especificado no existe en el sistema.");
        window.location.href = "usuariosAdmin.html";
        return;
    }

    // ==========================================================================
    // CAMBIO EN PASO 3: Rellenado de campos respetando los selects dinámicos
    // ==========================================================================
    document.getElementById("edit-user-title").textContent = `Modificar Usuario RUN: ${user.run}`;
    document.getElementById("edit-user-run").value = user.run;
    document.getElementById("edit-user-role").value = user.role;
    document.getElementById("edit-user-name").value = user.name;
    document.getElementById("edit-user-lastname").value = user.lastname;
    document.getElementById("edit-user-email").value = user.email;
    document.getElementById("edit-user-address").value = user.address;

    // Rescatamos los dos selects de la pantalla
    const selectReg = document.getElementById("edit-user-region");
    const selectCom = document.getElementById("edit-user-comuna");
    
    if (selectReg && selectCom) {
        // 1. Asignamos la región que el usuario ya tenía guardada
        selectReg.value = user.region;
        
        // 2. ¡La magia!: Forzamos manualmente el evento 'change' para que se ejecute la lista de comunas
        selectReg.dispatchEvent(new Event('change'));
        
        // 3. Ahora que el select ya tiene las comunas cargadas, asignamos la comuna del usuario
        selectCom.value = user.comuna;
    }

    // 4. Capturamos el submit para persistir los cambios modificados
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const roleIn = document.getElementById("edit-user-role");
        const nameIn = document.getElementById("edit-user-name");
        const lastnameIn = document.getElementById("edit-user-lastname");
        const emailIn = document.getElementById("edit-user-email");
        const regionIn = document.getElementById("edit-user-region");
        const comunaIn = document.getElementById("edit-user-comuna");
        const addressIn = document.getElementById("edit-user-address");

        const errRole = document.getElementById("error-edit-user-role");
        const errName = document.getElementById("error-edit-user-name");
        const errLastname = document.getElementById("error-edit-user-lastname");
        const errEmail = document.getElementById("error-edit-user-email");
        const errRegion = document.getElementById("error-edit-user-region");
        const errComuna = document.getElementById("error-edit-user-comuna");
        const errAddress = document.getElementById("error-edit-user-address");

        // Limpieza de mensajes
        [errRole, errName, errLastname, errEmail, errRegion, errComuna, errAddress].forEach(el => el.textContent = "");

        let isValid = true;

        // Validaciones estrictas de INACAP
        if (!roleIn.value) { errRole.textContent = "Seleccione un rol."; isValid = false; }
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; }
        if (!lastnameIn.value.trim()) { errLastname.textContent = "El apellido es obligatorio."; isValid = false; }

        const emailVal = emailIn.value.trim().toLowerCase();
        if (!emailVal) {
            errEmail.textContent = "El correo es obligatorio.";
            isValid = false;
        } else {
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                errEmail.textContent = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                isValid = false;
            }
        }

        if (!regionIn.value) { errRegion.textContent = "Región requerida."; isValid = false; }
        if (!comunaIn.value) { errComuna.textContent = "Comuna requerida."; isValid = false; }
        if (!addressIn.value.trim()) { errAddress.textContent = "La dirección es obligatoria."; isValid = false; }

        if (isValid) {
            // Modificamos el objeto dentro de nuestro arreglo clonado
            user.role = roleIn.value;
            user.name = nameIn.value.trim();
            user.lastname = lastnameIn.value.trim();
            user.email = emailVal;
            user.region = regionIn.value;
            user.comuna = comunaIn.value;
            user.address = addressIn.value.trim();

            // Guardamos la lista de usuarios actualizada de vuelta en LocalStorage
            localStorage.setItem("huerto_users_catalog", JSON.stringify(usersList));

            alert("¡Usuario modificado con éxito!");
            window.location.href = "usuariosAdmin.html"; // Redirige al listado actualizado
        }
    });
}

// Inicializar al cargar la ventana
document.addEventListener("DOMContentLoaded", () => {
    initEditUserPage();
});

// ==========================================================================
/* BASE DE DATOS Y LÓGICA DE REGIONES Y COMUNAS DINÁMICAS */
// ==========================================================================

const chileUbicaciones = {
    "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "San Bernardo"],
    "Región de Valparaíso": ["Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana", "San Antonio"],
    "Región del Biobío": ["Concepción", "Nacimiento", "Talcahuano", "Los Ángeles", "Chiguayante"],
    "Región de la Araucanía": ["Villarrica", "Temuco", "Pucón", "Angol", "Padre Las Casas"],
    "Región de Los Lagos": ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"]
};

// Función global para inicializar los selects en cualquier formulario (público o admin)
function setupRegionesYComunas(idRegion, idComuna) {
    const selectRegion = document.getElementById(idRegion);
    const selectComuna = document.getElementById(idComuna);

    if (!selectRegion || !selectComuna) return;

    // 1. Poblamos el select de Regiones
    selectRegion.innerHTML = '<option value="">-- Seleccione Región --</option>';
    Object.keys(chileUbicaciones).forEach(region => {
        const opt = document.createElement("option");
        opt.value = region;
        opt.textContent = region;
        selectRegion.appendChild(opt);
    });

    // 2. Escuchamos el cambio de Región para poblar las Comunas
    selectRegion.addEventListener("change", () => {
        const regionSeleccionada = selectRegion.value;
        selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';

        if (regionSeleccionada && chileUbicaciones[regionSeleccionada]) {
            chileUbicaciones[regionSeleccionada].forEach(comuna => {
                const opt = document.createElement("option");
                opt.value = comuna;
                opt.textContent = comuna;
                selectComuna.appendChild(opt);
            });
        } else {
            selectComuna.innerHTML = '<option value="">-- Primero elija una región --</option>';
        }
    });
}

// Inicialización automática en las páginas correspondientes al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    // Si estamos en nuevoUsuario.html
    setupRegionesYComunas("user-region", "user-comuna");
    
    // Si estamos en editarUsuario.html
    setupRegionesYComunas("edit-user-region", "edit-user-comuna");
});