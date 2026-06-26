// ==========================================================================
/* INTERACTIVIDAD DEL MAPA DE SUCURSALES (PÁGINA NOSOTROS) */
// ==========================================================================
function initStoreMap() {
    const mapContainer = document.getElementById("interactive-store-map"); // [cite: 5]
    const buttons = document.querySelectorAll(".city-btn"); // [cite: 6]
    
    if (mapContainer && buttons.length > 0) { // [cite: 8]
        buttons.forEach(button => { // [cite: 9]
            button.addEventListener("click", () => { // [cite: 10]
                buttons.forEach(btn => btn.classList.remove("active")); // [cite: 12]
                button.classList.add("active"); // [cite: 13]
                const targetLocation = button.getAttribute("data-location"); // [cite: 15]
                const encodedLocation = encodeURIComponent(targetLocation); // [cite: 17]
                mapContainer.src = `https://maps.google.com/maps?q=$${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`; // [cite: 19]
            });
        });
    }
}

// ==========================================================================
/* GESTIÓN DINÁMICA DEL MANTENEDOR DE PRODUCTOS (productosAdmin.html) */
// ==========================================================================
const initialProducts = [ // [cite: 28]
    { code: "FR001", category: "Frutas Frescas", name: "Manzanas Fuji", price: 1200, stock: 150 }, // [cite: 29]
    { code: "FR002", category: "Frutas Frescas", name: "Naranjas Valencia", price: 1000, stock: 200 }, // [cite: 30]
    { code: "FR003", category: "Frutas Frescas", name: "Plátanos Cavendish", price: 800, stock: 250 }, // [cite: 31]
    { code: "VR001", category: "Verduras Orgánicas", name: "Zanahorias Orgánicas", price: 900, stock: 100 }, // [cite: 32]
    { code: "VR002", category: "Verduras Orgánicas", name: "Espinacas Frescas (500g)", price: 700, stock: 80 }, // [cite: 33]
    { code: "VR003", category: "Verduras Orgánicas", name: "Pimientos Tricolores", price: 1500, stock: 120 }, // [cite: 34]
    { code: "PO001", category: "Productos Orgánicos", name: "Miel Orgánica (500g)", price: 5000, stock: 50 }, // [cite: 35]
    { code: "PO003", category: "Productos Orgánicos", name: "Quinua Orgánica", price: 2400, stock: 90 }, // [cite: 36]
    { code: "PL001", category: "Productos Lácteos", name: "Leche Entera", price: 1100, stock: 110 } // [cite: 37]
];

function getStoredProducts() { // [cite: 40]
    const stored = localStorage.getItem("huerto_products_catalog"); // [cite: 41]
    if (!stored) { // [cite: 42]
        localStorage.setItem("huerto_products_catalog", JSON.stringify(initialProducts)); // [cite: 44]
        return initialProducts; // [cite: 45]
    }
    return JSON.parse(stored); // [cite: 47]
}

function renderAdminProductsTable() { // [cite: 50]
    const tableBody = document.getElementById("admin-products-table-body"); // [cite: 51]
    if (!tableBody) return; // [cite: 52]
    const products = getStoredProducts(); // [cite: 53]
    tableBody.innerHTML = ""; // [cite: 54]
    if (products.length === 0) { // [cite: 55]
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No hay productos en el inventario.</td></tr>`; // [cite: 56]
        return; // [cite: 57]
    }
    products.forEach(product => { // [cite: 59]
        const row = document.createElement("tr"); // [cite: 60]
        let catClass = "badge-cat"; // [cite: 62]
        if (product.category.includes("Verduras")) catClass += " badge-green"; // [cite: 63]
        if (product.category.includes("Orgánicos")) catClass += " badge-brown"; // [cite: 64]
        if (product.category.includes("Lácteos")) catClass += " badge-blue"; // [cite: 65]
        row.innerHTML = `
            <td class="text-bold">${product.code}</td>
            <td><span class="${catClass}">${product.category}</span></td>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString('es-CL')} CLP</td>
            <td>${product.stock}</td>
            <td>
                <div class="table-actions-group">
                    <a href="editarProducto.html?code=${product.code}" class="btn-table-edit" title="Editar"> ✏️ </a>
                    <button type="button" class="btn-table-delete" onclick="deleteProductFromAdmin('${product.code}')" title="Eliminar"> 🗑️ </button>
                </div>
            </td>
        `; // [cite: 66]
        tableBody.appendChild(row); // [cite: 79]
    });
}

window.deleteProductFromAdmin = (code) => { // [cite: 83]
    if (confirm(`¿Está seguro de que desea eliminar el producto con código ${code}?`)) { // [cite: 84]
        let products = getStoredProducts(); // [cite: 85]
        products = products.filter(p => p.code !== code); // [cite: 87]
        localStorage.setItem("huerto_products_catalog", JSON.stringify(products)); // [cite: 89]
        renderAdminProductsTable(); // [cite: 91]
    }
};

// ==========================================================================
/* PROCESAMIENTO Y VALIDACIÓN DE NUEVOS PRODUCTOS (nuevoProducto.html) */
// ==========================================================================
function initAddProductPage() {
    const addProductForm = document.getElementById("form-admin-add-product"); // [cite: 102]
    if (!addProductForm) return;

    addProductForm.addEventListener("submit", (e) => { // [cite: 104]
        e.preventDefault(); // [cite: 105]
        const codeIn = document.getElementById("prod-code"); // [cite: 107]
        const catIn = document.getElementById("prod-category"); // [cite: 108]
        const nameIn = document.getElementById("prod-name"); // [cite: 109]
        const priceIn = document.getElementById("prod-price"); // [cite: 110]
        const stockIn = document.getElementById("prod-stock"); // [cite: 111]
        const descIn = document.getElementById("prod-desc"); // [cite: 112]

        const errCode = document.getElementById("error-prod-code"); // [cite: 114]
        const errCat = document.getElementById("error-prod-category"); // [cite: 115]
        const errName = document.getElementById("error-prod-name"); // [cite: 116]
        const errPrice = document.getElementById("error-prod-price"); // [cite: 117]
        const errStock = document.getElementById("error-prod-stock"); // [cite: 118]

        [errCode, errCat, errName, errPrice, errStock].forEach(el => el.textContent = ""); // [cite: 120]
        let isValid = true; // [cite: 121]
        const currentCatalog = getStoredProducts(); // [cite: 122]

        const codeVal = codeIn.value.trim().toUpperCase(); // [cite: 124]
        if (!codeVal) { errCode.textContent = "El código es obligatorio."; isValid = false; } // [cite: 125, 127]
        else if (codeVal.length < 3) { errCode.textContent = "Mínimo 3 caracteres."; isValid = false; } // [cite: 128, 130]
        else if (currentCatalog.some(p => p.code === codeVal)) { errCode.textContent = "Este código ya está registrado."; isValid = false; } // [cite: 131, 133]

        if (!catIn.value) { errCat.textContent = "Debe seleccionar una categoría."; isValid = false; } // [cite: 136, 138]
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; } // [cite: 142, 144]

        const priceVal = parseFloat(priceIn.value); // [cite: 147]
        if (isNaN(priceVal) || priceVal < 0) { errPrice.textContent = "Precio inválido (Mínimo 0)."; isValid = false; } // [cite: 148, 150]

        const stockVal = parseInt(stockIn.value, 10); // [cite: 153]
        if (isNaN(stockVal) || stockVal < 0) { errStock.textContent = "Stock inválido (Mínimo 0)."; isValid = false; } // [cite: 154, 156]

        if (isValid) { // [cite: 159]
            const newProduct = { // [cite: 160]
                code: codeVal, // [cite: 161]
                category: catIn.value, // [cite: 162]
                name: nameVal, // [cite: 163]
                price: priceVal, // [cite: 164]
                stock: stockVal, // [cite: 165]
                description: descIn.value.trim() // [cite: 166]
            };
            currentCatalog.push(newProduct); // [cite: 168]
            localStorage.setItem("huerto_products_catalog", JSON.stringify(currentCatalog)); // [cite: 169]
            alert("¡Producto agregado exitosamente al catálogo!"); // [cite: 170]
            window.location.href = "productosAdmin.html"; // [cite: 171]
        }
    });
}

// ==========================================================================
/* EDICIÓN Y ACTUALIZACIÓN DE PRODUCTOS EXISTENTES (editarProducto.html) */
// ==========================================================================
function initEditProductPage() {
    const editForm = document.getElementById("form-admin-edit-product"); // [cite: 180]
    if (!editForm) return; // [cite: 181]
    const urlParams = new URLSearchParams(window.location.search); // [cite: 183]
    const productCode = urlParams.get("code"); // [cite: 184]
    if (!productCode) { // [cite: 185]
        alert("Código de producto no especificado."); // [cite: 186]
        window.location.href = "productosAdmin.html"; // [cite: 187]
        return; // [cite: 188]
    }
    const catalog = getStoredProducts(); // [cite: 191]
    const product = catalog.find(p => p.code === productCode); // [cite: 192]
    if (!product) { // [cite: 193]
        alert("El producto especificado no existe en el catálogo."); // [cite: 194]
        window.location.href = "productosAdmin.html"; // [cite: 195]
        return; // [cite: 196]
    }
    document.getElementById("edit-form-title").textContent = `Modificar Producto: ${product.code}`; // [cite: 199]
    document.getElementById("edit-prod-code").value = product.code; // [cite: 200]
    document.getElementById("edit-prod-category").value = product.category; // [cite: 201]
    document.getElementById("edit-prod-name").value = product.name; // [cite: 202]
    document.getElementById("edit-prod-price").value = product.price; // [cite: 203]
    document.getElementById("edit-prod-stock").value = product.stock; // [cite: 204]
    document.getElementById("edit-prod-desc").value = product.description || ""; // [cite: 205]

    editForm.addEventListener("submit", (e) => { // [cite: 207]
        e.preventDefault(); // [cite: 208]
        const nameIn = document.getElementById("edit-prod-name"); // [cite: 210]
        const catIn = document.getElementById("edit-prod-category"); // [cite: 211]
        const priceIn = document.getElementById("edit-prod-price"); // [cite: 212]
        const stockIn = document.getElementById("edit-prod-stock"); // [cite: 213]
        const descIn = document.getElementById("edit-prod-desc"); // [cite: 214]

        const errName = document.getElementById("error-edit-name"); // [cite: 216]
        const errCat = document.getElementById("error-edit-cat"); // [cite: 217]
        const errPrice = document.getElementById("error-edit-price"); // [cite: 218]
        const errStock = document.getElementById("error-edit-stock"); // [cite: 219]

        [errName, errCat, errPrice, errStock].forEach(el => el.textContent = ""); // [cite: 221]
        let isValid = true; // [cite: 222]
        if (!catIn.value) { errCat.textContent = "Debe seleccionar una categoría."; isValid = false; } // [cite: 224]
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; } // [cite: 225]
        const priceVal = parseFloat(priceIn.value); // [cite: 226]
        if (isNaN(priceVal) || priceVal < 0) { errPrice.textContent = "Precio inválido."; isValid = false; } // [cite: 227]
        const stockVal = parseInt(stockIn.value, 10); // [cite: 228]
        if (isNaN(stockVal) || stockVal < 0) { errStock.textContent = "Stock inválido."; isValid = false; } // [cite: 229]
        if (isValid) { // [cite: 230]
            product.category = catIn.value; // [cite: 232]
            product.name = nameIn.value.trim(); // [cite: 233]
            product.price = priceVal; // [cite: 234]
            product.stock = stockVal; // [cite: 235]
            product.description = descIn.value.trim(); // [cite: 236]
            localStorage.setItem("huerto_products_catalog", JSON.stringify(catalog)); // [cite: 238]
            alert("¡Producto actualizado exitosamente!"); // [cite: 239]
            window.location.href = "productosAdmin.html"; // [cite: 240]
        }
    });
}

// ==========================================================================
/* GESTIÓN MANTENEDOR DE USUARIOS COMPARTIDO (usuariosAdmin.html) */
// ==========================================================================
const initialUsers = [
    { run: "19011022K", name: "Administrador", lastname: "Huerto Hogar", email: "admin@inacap.cl", role: "Administrador", region: "Región Metropolitana", comuna: "Santiago" },
    { run: "154432218", name: "Carlos", lastname: "Mendoza Silva", email: "carlos@gmail.com", role: "Vendedor", region: "Región de la Araucanía", comuna: "Villarrica" },
    { run: "213349902", name: "María José", lastname: "Fuenzalida Oliva", email: "mariajose@profesor.inacap.cl", role: "Cliente", region: "Región Metropolitana", comuna: "Santiago" }
];

function getStoredUsers() { // [cite: 434]
    const stored = localStorage.getItem("huerto_users_catalog"); // [cite: 434]
    if (!stored) {
        localStorage.setItem("huerto_users_catalog", JSON.stringify(initialUsers));
        return initialUsers;
    }
    return JSON.parse(stored); // [cite: 434]
}

function renderAdminUsersTable() {
    const tableBody = document.getElementById("admin-users-table-body");
    if (!tableBody) return;
    const users = getStoredUsers();
    tableBody.innerHTML = "";
    if (users.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No hay usuarios en el registro.</td></tr>`;
        return;
    }
    users.forEach(user => {
        const row = document.createElement("tr");
        let roleClass = "badge-cat";
        if (user.role === "Administrador") roleClass += " badge-brown";
        if (user.role === "Vendedor") roleClass += " badge-blue";
        if (user.role === "Cliente") roleClass += " badge-green";
        
        row.innerHTML = `
            <td class="text-bold">${user.run}</td>
            <td>${user.name} ${user.lastname}</td>
            <td>${user.email}</td>
            <td><span class="${roleClass}">${user.role}</span></td>
            <td>${user.comuna}, ${user.region}</td>
            <td>
                <div class="table-actions-group">
                    <a href="editarUsuario.html?run=${user.run}" class="btn-table-edit" title="Editar"> ✏️ </a>
                    <button type="button" class="btn-table-delete" onclick="deleteUserFromAdmin('${user.run}')" title="Eliminar"> 🗑️ </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

window.deleteUserFromAdmin = (run) => {
    if (run === "19011022K") {
        alert("No se puede eliminar el administrador principal.");
        return;
    }
    if (confirm(`¿Está seguro de que desea eliminar al usuario con RUN ${run}?`)) {
        let users = getStoredUsers();
        users = users.filter(u => u.run !== run);
        localStorage.setItem("huerto_users_catalog", JSON.stringify(users));
        renderAdminUsersTable();
    }
};

// ==========================================================================
/* PROCESAMIENTO Y VALIDACIÓN DE NUEVOS USUARIOS (nuevoUsuario.html) */
// ==========================================================================
function initAddUserPage() {
    const addUserForm = document.getElementById("form-admin-add-user"); // [cite: 252]
    if (!addUserForm) return; // [cite: 253]

    addUserForm.addEventListener("submit", (e) => { // [cite: 254]
        e.preventDefault(); // [cite: 255]
        const runIn = document.getElementById("user-run"); // [cite: 257]
        const roleIn = document.getElementById("user-role"); // [cite: 258]
        const nameIn = document.getElementById("user-name"); // [cite: 259]
        const lastnameIn = document.getElementById("user-lastname"); // [cite: 260]
        const emailIn = document.getElementById("user-email"); // [cite: 261]
        const regionIn = document.getElementById("user-region"); // [cite: 262]
        const comunaIn = document.getElementById("user-comuna"); // [cite: 263]

        const errRun = document.getElementById("error-user-run"); // [cite: 266]
        const errRole = document.getElementById("error-user-role"); // [cite: 267]
        const errName = document.getElementById("error-user-name"); // [cite: 268]
        const errLastname = document.getElementById("error-user-lastname"); // [cite: 269]
        const errEmail = document.getElementById("error-user-email"); // [cite: 270]
        const errRegion = document.getElementById("error-user-region"); // [cite: 271]
        const errComuna = document.getElementById("error-user-comuna"); // [cite: 272]

        [errRun, errRole, errName, errLastname, errEmail, errRegion, errComuna].forEach(el => el.textContent = ""); // [cite: 275]
        let isValid = true; // [cite: 276]
        const currentUsers = getStoredUsers(); // [cite: 277]

        const runVal = runIn.value.trim().toUpperCase(); // [cite: 279]
        if (!runVal) { errRun.textContent = "El RUN es obligatorio."; isValid = false; } // [cite: 280, 282]
        else if (runVal.length < 7 || runVal.length > 9) { errRun.textContent = "Debe tener entre 7 y 9 caracteres."; isValid = false; } // [cite: 283, 285]
        else if (currentUsers.some(u => u.run === runVal)) { errRun.textContent = "Este RUN ya está registrado en el sistema."; isValid = false; } // [cite: 286, 288]

        if (!roleIn.value) { errRole.textContent = "Seleccione un rol."; isValid = false; } // [cite: 291]
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; } // [cite: 293]
        if (!lastnameIn.value.trim()) { errLastname.textContent = "El apellido es obligatorio."; isValid = false; } // [cite: 294]

        const emailVal = emailIn.value.trim().toLowerCase(); // [cite: 296]
        if (!emailVal) { errEmail.textContent = "El correo es obligatorio."; isValid = false; } // [cite: 297, 299]
        else {
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                errEmail.textContent = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                isValid = false; // [cite: 304]
            }
        }

        if (!regionIn.value) { errRegion.textContent = "Región requerida."; isValid = false; } // [cite: 308]
        if (!comunaIn.value) { errComuna.textContent = "Comuna requerida."; isValid = false; } // [cite: 309]

        if (isValid) { // [cite: 312]
            const newUser = { // [cite: 313]
                run: runVal, // [cite: 314]
                role: roleIn.value, // [cite: 315]
                name: nameIn.value.trim(), // [cite: 316]
                lastname: lastnameIn.value.trim(), // [cite: 317]
                email: emailVal, // [cite: 318]
                region: regionIn.value, // [cite: 319]
                comuna: comunaIn.value // [cite: 320]
            };
            currentUsers.push(newUser); // [cite: 323]
            localStorage.setItem("huerto_users_catalog", JSON.stringify(currentUsers)); // [cite: 324]
            alert("¡Usuario creado de manera exitosa!"); // [cite: 325]
            window.location.href = "usuariosAdmin.html"; // [cite: 326]
        }
    });
}

// ==========================================================================
/* EDICIÓN Y ACTUALIZACIÓN DE USUARIOS EXISTENTES ADMIN (editarUsuario.html) */
// ==========================================================================
function initEditUserPage() {
    const editForm = document.getElementById("form-admin-edit-user"); // [cite: 335]
    if (!editForm) return; // [cite: 336]
    const urlParams = new URLSearchParams(window.location.search); // [cite: 338]
    const userRun = urlParams.get("run"); // [cite: 339]
    if (!userRun) { // [cite: 340]
        alert("RUN de usuario no especificado."); // [cite: 341]
        window.location.href = "usuariosAdmin.html"; // [cite: 342]
        return; // [cite: 343]
    }
    const usersList = getStoredUsers(); // [cite: 346]
    const user = usersList.find(u => u.run === userRun); // [cite: 347]
    if (!user) { // [cite: 348]
        alert("El usuario especificado no existe en el sistema."); // [cite: 349]
        window.location.href = "usuariosAdmin.html"; // [cite: 350]
        return; // [cite: 351]
    }
    document.getElementById("edit-user-title").textContent = `Modificar Usuario RUN: ${user.run}`; // [cite: 356]
    document.getElementById("edit-user-run").value = user.run; // [cite: 357]
    document.getElementById("edit-user-role").value = user.role; // [cite: 358]
    document.getElementById("edit-user-name").value = user.name; // [cite: 359]
    document.getElementById("edit-user-lastname").value = user.lastname; // [cite: 360]
    document.getElementById("edit-user-email").value = user.email; // [cite: 361]
    
    const selectReg = document.getElementById("edit-user-region"); // [cite: 364]
    const selectCom = document.getElementById("edit-user-comuna"); // [cite: 365]

    if (selectReg && selectCom) { // [cite: 366]
        selectReg.value = user.region; // [cite: 368]
        selectReg.dispatchEvent(new Event('change')); // [cite: 370]
        selectCom.value = user.comuna; // [cite: 372]
    }
    editForm.addEventListener("submit", (e) => { // [cite: 375]
        e.preventDefault(); // [cite: 376]
        const roleIn = document.getElementById("edit-user-role"); // [cite: 377]
        const nameIn = document.getElementById("edit-user-name"); // [cite: 378]
        const lastnameIn = document.getElementById("edit-user-lastname"); // [cite: 379]
        const emailIn = document.getElementById("edit-user-email"); // [cite: 380]
        const regionIn = document.getElementById("edit-user-region"); // [cite: 381]
        const comunaIn = document.getElementById("edit-user-comuna"); // [cite: 382]
        
        const errRole = document.getElementById("error-edit-user-role"); // [cite: 384]
        const errName = document.getElementById("error-edit-user-name"); // [cite: 385]
        const errLastname = document.getElementById("error-edit-user-lastname"); // [cite: 386]
        const errEmail = document.getElementById("error-edit-user-email"); // [cite: 387]
        const errRegion = document.getElementById("error-edit-user-region"); // [cite: 388]
        const errComuna = document.getElementById("error-edit-user-comuna"); // [cite: 389]
        
        [errRole, errName, errLastname, errEmail, errRegion, errComuna].forEach(el => el.textContent = ""); // [cite: 392]
        let isValid = true; // [cite: 393]
        if (!roleIn.value) { errRole.textContent = "Seleccione un rol."; isValid = false; } // [cite: 395]
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; } // [cite: 396]
        if (!lastnameIn.value.trim()) { errLastname.textContent = "El apellido es obligatorio."; isValid = false; } // [cite: 397]
        const emailVal = emailIn.value.trim().toLowerCase(); // [cite: 398]
        if (!emailVal) { errEmail.textContent = "El correo es obligatorio."; isValid = false; } // [cite: 399, 401]
        else {
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                errEmail.textContent = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                isValid = false; // [cite: 406]
            }
        }
        if (!regionIn.value) { errRegion.textContent = "Región requerida."; isValid = false; } // [cite: 409]
        if (!comunaIn.value) { errComuna.textContent = "Comuna requerida."; isValid = false; } // [cite: 410]
        if (isValid) { // [cite: 412]
            user.role = roleIn.value; // [cite: 414]
            user.name = nameIn.value.trim(); // [cite: 415]
            user.lastname = lastnameIn.value.trim(); // [cite: 416]
            user.email = emailVal; // [cite: 417]
            user.region = regionIn.value; // [cite: 418]
            user.comuna = comunaIn.value; // [cite: 419]
            localStorage.setItem("huerto_users_catalog", JSON.stringify(usersList)); // [cite: 422]
            alert("¡Usuario modificado con éxito!"); // [cite: 423]
            window.location.href = "usuariosAdmin.html"; // [cite: 424]
        }
    });
}

// ==========================================================================
/* BASE DE DATOS Y LÓGICA DE REGIONES Y COMUNAS DINÁMICAS */
// ==========================================================================
const chileUbicaciones = { // [cite: 435]
    "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "San Bernardo"], // [cite: 436]
    "Región de Valparaíso": ["Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana", "San Antonio"], // [cite: 437]
    "Región del Biobío": ["Concepción", "Nacimiento", "Talcahuano", "Los Ángeles", "Chiguayante"], // [cite: 438]
    "Región de la Araucanía": ["Villarrica", "Temuco", "Pucón", "Angol", "Padre Las Casas"], // [cite: 439]
    "Región de Los Lagos": ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"] // [cite: 440]
};

function setupRegionesYComunas(idRegion, idComuna) { // [cite: 443]
    const selectRegion = document.getElementById(idRegion); // [cite: 444]
    const selectComuna = document.getElementById(idComuna); // [cite: 445]
    if (!selectRegion || !selectComuna) return; // [cite: 446]

    selectRegion.innerHTML = '<option value="">-- Seleccione Región --</option>'; // [cite: 448]
    Object.keys(chileUbicaciones).forEach(region => { // [cite: 449]
        const opt = document.createElement("option"); // [cite: 450]
        opt.value = region; // [cite: 451]
        opt.textContent = region; // [cite: 452]
        selectRegion.appendChild(opt); // [cite: 453]
    });
    selectRegion.addEventListener("change", () => { // [cite: 456]
        const regionSeleccionada = selectRegion.value; // [cite: 457]
        selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>'; // [cite: 458]
        if (regionSeleccionada && chileUbicaciones[regionSeleccionada]) { // [cite: 459]
            chileUbicaciones[regionSeleccionada].forEach(comuna => { // [cite: 460]
                const opt = document.createElement("option"); // [cite: 461]
                opt.value = comuna; // [cite: 462]
                opt.textContent = comuna; // [cite: 463]
                selectComuna.appendChild(opt); // [cite: 464]
            });
        } else {
            selectComuna.innerHTML = '<option value="">-- Primero elija una region --</option>'; // [cite: 467]
        }
    });
}

// ==========================================================================
/* CONTROL DE CARGA CENTRALIZADO ÚNICO GATILLADO AL INICIO */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => { // [cite: 472]
    initStoreMap(); // [cite: 1]

    if (document.getElementById("admin-products-table-body")) {
        renderAdminProductsTable();
    }

    if (document.getElementById("admin-users-table-body")) {
        renderAdminUsersTable();
    }

    initAddProductPage();
    initEditProductPage();

    if (document.getElementById("form-admin-add-user")) { // [cite: 473]
        setupRegionesYComunas("user-region", "user-comuna"); // [cite: 474]
        initAddUserPage();
    }
    if (document.getElementById("form-admin-edit-user")) { // [cite: 475]
        setupRegionesYComunas("edit-user-region", "edit-user-comuna"); // [cite: 476]
        initEditUserPage();
    }
});