// ==========================================================================
/* INTERACTIVIDAD DEL MAPA DE SUCURSALES (PÁGINA NOSOTROS) */
// ==========================================================================
function initStoreMap() {
    const mapContainer = document.getElementById("interactive-store-map");
    const buttons = document.querySelectorAll(".city-btn");

    if (mapContainer && buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                buttons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                const targetLocation = button.getAttribute("data-location");
                const encodedLocation = encodeURIComponent(targetLocation);
                mapContainer.src = `http://googleusercontent.com/maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
            });
        });
    }
}

// ==========================================================================
/* GESTIÓN DINÁMICA DEL MANTENEDOR DE PRODUCTOS (productosAdmin.html) */
// ==========================================================================
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

function getStoredProducts() {
    const stored = localStorage.getItem("huerto_products_catalog");
    if (!stored) {
        localStorage.setItem("huerto_products_catalog", JSON.stringify(initialProducts));
        return initialProducts;
    }
    return JSON.parse(stored);
}

function renderAdminProductsTable() {
    const tableBody = document.getElementById("admin-products-table-body");
    if (!tableBody) return;
    const products = getStoredProducts();
    tableBody.innerHTML = "";
    if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No hay productos en el inventario.</td></tr>`;
        return;
    }
    products.forEach(product => {
        const row = document.createElement("tr");
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
                    <a href="editarProducto.html?code=${product.code}" class="btn-table-edit" title="Editar">  ✏️  </a>
                    <button type="button" class="btn-table-delete" onclick="deleteProductFromAdmin('${product.code}')" title="Eliminar">  🗑️  </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

window.deleteProductFromAdmin = (code) => {
    if (confirm(`¿Está seguro de que desea eliminar el producto con código ${code}?`)) {
        let products = getStoredProducts();
        products = products.filter(p => p.code !== code);
        localStorage.setItem("huerto_products_catalog", JSON.stringify(products));
        renderAdminProductsTable();
    }
};

// ==========================================================================
/* PROCESAMIENTO Y VALIDACIÓN DE NUEVOS PRODUCTOS (nuevoProducto.html) */
// ==========================================================================
function initAddProductPage() {
    const addProductForm = document.getElementById("form-admin-add-product");
    if (!addProductForm) return;
    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const codeIn = document.getElementById("prod-code");
        const catIn = document.getElementById("prod-category");
        const nameIn = document.getElementById("prod-name");
        const priceIn = document.getElementById("prod-price");
        const stockIn = document.getElementById("prod-stock");
        const descIn = document.getElementById("prod-desc");

        const errCode = document.getElementById("error-prod-code");
        const errCat = document.getElementById("error-prod-category");
        const errName = document.getElementById("error-prod-name");
        const errPrice = document.getElementById("error-prod-price");
        const errStock = document.getElementById("error-prod-stock");

        [errCode, errCat, errName, errPrice, errStock].forEach(el => el.textContent = "");
        let isValid = true;
        const currentCatalog = getStoredProducts();
        const codeVal = codeIn.value.trim().toUpperCase();

        if (!codeVal) { errCode.textContent = "El código es obligatorio."; isValid = false; }
        else if (codeVal.length < 3) { errCode.textContent = "Mínimo 3 caracteres."; isValid = false; }
        else if (currentCatalog.some(p => p.code === codeVal)) { errCode.textContent = "Este código ya está registrado."; isValid = false; }

        if (!catIn.value) { errCat.textContent = "Debe seleccionar una categoría."; isValid = false; }
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; }

        const priceVal = parseFloat(priceIn.value);
        if (isNaN(priceVal) || priceVal < 0) { errPrice.textContent = "Precio inválido (Mínimo 0)."; isValid = false; }

        const stockVal = parseInt(stockIn.value, 10);
        if (isNaN(stockVal) || stockVal < 0) { errStock.textContent = "Stock inválido (Mínimo 0)."; isValid = false; }

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
            window.location.href = "productosAdmin.html";
        }
    });
}

// ==========================================================================
/* EDICIÓN Y ACTUALIZACIÓN DE PRODUCTOS EXISTENTES (editarProducto.html) */
// ==========================================================================
function initEditProductPage() {
    const editForm = document.getElementById("form-admin-edit-product");
    if (!editForm) return;
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get("code");
    if (!productCode) {
        alert("Código de producto no especificado.");
        window.location.href = "productosAdmin.html";
        return;
    }
    const catalog = getStoredProducts();
    const product = catalog.find(p => p.code === productCode);
    if (!product) {
        alert("El producto especificado no existe en el catálogo.");
        window.location.href = "productosAdmin.html";
        return;
    }
    document.getElementById("edit-form-title").textContent = `Modificar Producto: ${product.code}`;
    document.getElementById("edit-prod-code").value = product.code;
    document.getElementById("edit-prod-category").value = product.category;
    document.getElementById("edit-prod-name").value = product.name;
    document.getElementById("edit-prod-price").value = product.price;
    document.getElementById("edit-prod-stock").value = product.stock;
    document.getElementById("edit-prod-desc").value = product.description || "";

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameIn = document.getElementById("edit-prod-name");
        const catIn = document.getElementById("edit-prod-category");
        const priceIn = document.getElementById("edit-prod-price");
        const stockIn = document.getElementById("edit-prod-stock");
        const descIn = document.getElementById("edit-prod-desc");

        const errName = document.getElementById("error-edit-name");
        const errCat = document.getElementById("error-edit-cat");
        const errPrice = document.getElementById("error-edit-price");
        const errStock = document.getElementById("error-edit-stock");

        [errName, errCat, errPrice, errStock].forEach(el => el.textContent = "");
        let isValid = true;
        if (!catIn.value) { errCat.textContent = "Debe seleccionar una categoría."; isValid = false; }
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; }
        const priceVal = parseFloat(priceIn.value);
        if (isNaN(priceVal) || priceVal < 0) { errPrice.textContent = "Precio inválido."; isValid = false; }
        const stockVal = parseInt(stockIn.value, 10);
        if (isNaN(stockVal) || stockVal < 0) { errStock.textContent = "Stock inválido."; isValid = false; }
        if (isValid) {
            product.category = catIn.value;
            product.name = nameIn.value.trim();
            product.price = priceVal;
            product.stock = stockVal;
            product.description = descIn.value.trim();
            localStorage.setItem("huerto_products_catalog", JSON.stringify(catalog));
            alert("¡Producto actualizado exitosamente!");
            window.location.href = "productosAdmin.html";
        }
    });
}

// ==========================================================================
/* GESTIÓN MANTENEDOR DE USUARIOS COMPARTIDO (usuariosAdmin.html) */
// ==========================================================================
const initialUsers = [
    { run: "19011022K", name: "Administrador", lastname: "Huerto Hogar", email: "admin@inacap.cl", password: "admin", role: "Administrador", region: "Región Metropolitana", comuna: "Santiago" },
    { run: "154432218", name: "Carlos", lastname: "Mendoza Silva", email: "carlos@gmail.com", password: "1234", role: "Vendedor", region: "Región de la Araucanía", comuna: "Villarrica" },
    { run: "213349902", name: "María José", lastname: "Fuenzalida Oliva", email: "mariajose@profesor.inacap.cl", password: "1234", role: "Cliente", region: "Región Metropolitana", comuna: "Santiago" }
];

function getStoredUsers() {
    const stored = localStorage.getItem("huerto_users_catalog");
    if (!stored) {
        localStorage.setItem("huerto_users_catalog", JSON.stringify(initialUsers));
        return initialUsers;
    }
    return JSON.parse(stored);
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
                    <a href="editarUsuario.html?run=${user.run}" class="btn-table-edit" title="Editar">  ✏️  </a>
                    <button type="button" class="btn-table-delete" onclick="deleteUserFromAdmin('${user.run}')" title="Eliminar">  🗑️  </button>
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
/* PROCESAMIENTO Y VALIDACIÓN DE NUEVOS USUARIOS PANEL ADMIN (nuevoUsuario.html) */
// ==========================================================================
function initAddUserPage() {
    const addUserForm = document.getElementById("form-admin-add-user");
    if (!addUserForm) return;
    addUserForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const runIn = document.getElementById("user-run");
        const roleIn = document.getElementById("user-role");
        const nameIn = document.getElementById("user-name");
        const lastnameIn = document.getElementById("user-lastname");
        const emailIn = document.getElementById("user-email");
        const regionIn = document.getElementById("user-region");
        const comunaIn = document.getElementById("user-comuna");

        const errRun = document.getElementById("error-user-run");
        const errRole = document.getElementById("error-user-role");
        const errName = document.getElementById("error-user-name");
        const errLastname = document.getElementById("error-user-lastname");
        const errEmail = document.getElementById("error-user-email");
        const errRegion = document.getElementById("error-user-region");
        const errComuna = document.getElementById("error-user-comuna");

        [errRun, errRole, errName, errLastname, errEmail, errRegion, errComuna].forEach(el => el.textContent = "");
        let isValid = true;
        const currentUsers = getStoredUsers();
        const runVal = runIn.value.trim().toUpperCase();

        if (!runVal) { errRun.textContent = "El RUN es obligatorio."; isValid = false; }
        else if (runVal.length < 7 || runVal.length > 9) { errRun.textContent = "Debe tener entre 7 y 9 caracteres."; isValid = false; }
        else if (currentUsers.some(u => u.run === runVal)) { errRun.textContent = "Este RUN ya está registrado en el sistema."; isValid = false; }

        if (!roleIn.value) { errRole.textContent = "Seleccione un rol."; isValid = false; }
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; }
        if (!lastnameIn.value.trim()) { errLastname.textContent = "El apellido es obligatorio."; isValid = false; }

        const emailVal = emailIn.value.trim().toLowerCase();
        if (!emailVal) { errEmail.textContent = "El correo es obligatorio."; isValid = false; }
        else {
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                errEmail.textContent = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                isValid = false;
            } else if (currentUsers.some(u => u.email === emailVal)) {
                errEmail.textContent = "Este correo electrónico ya está registrado.";
                isValid = false;
            }
        }

        if (!regionIn.value) { errRegion.textContent = "Región requerida."; isValid = false; }
        if (!comunaIn.value) { errComuna.textContent = "Comuna requerida."; isValid = false; }

        if (isValid) {
            const newUser = {
                run: runVal,
                role: roleIn.value,
                name: nameIn.value.trim(),
                lastname: lastnameIn.value.trim(),
                email: emailVal,
                password: "1234", // Contraseña genérica por defecto para usuarios creados por Admin
                region: regionIn.value,
                comuna: comunaIn.value
            };
            currentUsers.push(newUser);
            localStorage.setItem("huerto_users_catalog", JSON.stringify(currentUsers));
            alert("¡Usuario creado de manera exitosa!");
            window.location.href = "usuariosAdmin.html";
        }
    });
}

// ==========================================================================
/* EDICIÓN Y ACTUALIZACIÓN DE USUARIOS EXISTENTES ADMIN (editarUsuario.html) */
// ==========================================================================
function initEditUserPage() {
    const editForm = document.getElementById("form-admin-edit-user");
    if (!editForm) return;
    const urlParams = new URLSearchParams(window.location.search);
    const userRun = urlParams.get("run");
    if (!userRun) {
        alert("RUN de usuario no especificado.");
        window.location.href = "usuariosAdmin.html";
        return;
    }
    const usersList = getStoredUsers();
    const user = usersList.find(u => u.run === userRun);
    if (!user) {
        alert("El usuario especificado no existe en el sistema.");
        window.location.href = "usuariosAdmin.html";
        return;
    }
    document.getElementById("edit-user-title").textContent = `Modificar Usuario RUN: ${user.run}`;
    document.getElementById("edit-user-run").value = user.run;
    document.getElementById("edit-user-role").value = user.role;
    document.getElementById("edit-user-name").value = user.name;
    document.getElementById("edit-user-lastname").value = user.lastname;
    document.getElementById("edit-user-email").value = user.email;

    const selectReg = document.getElementById("edit-user-region");
    const selectCom = document.getElementById("edit-user-comuna");
    if (selectReg && selectCom) {
        selectReg.value = user.region;
        selectReg.dispatchEvent(new Event('change'));
        selectCom.value = user.comuna;
    }
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const roleIn = document.getElementById("edit-user-role");
        const nameIn = document.getElementById("edit-user-name");
        const lastnameIn = document.getElementById("edit-user-lastname");
        const emailIn = document.getElementById("edit-user-email");
        const regionIn = document.getElementById("edit-user-region");
        const comunaIn = document.getElementById("edit-user-comuna");

        const errRole = document.getElementById("error-edit-user-role");
        const errName = document.getElementById("error-edit-user-name");
        const errLastname = document.getElementById("error-edit-user-lastname");
        const errEmail = document.getElementById("error-edit-user-email");
        const errRegion = document.getElementById("error-edit-user-region");
        const errComuna = document.getElementById("error-edit-user-comuna");

        [errRole, errName, errLastname, errEmail, errRegion, errComuna].forEach(el => el.textContent = "");
        let isValid = true;
        if (!roleIn.value) { errRole.textContent = "Seleccione un rol."; isValid = false; }
        if (!nameIn.value.trim()) { errName.textContent = "El nombre es obligatorio."; isValid = false; }
        if (!lastnameIn.value.trim()) { errLastname.textContent = "El apellido es obligatorio."; isValid = false; }
        const emailVal = emailIn.value.trim().toLowerCase();
        if (!emailVal) { errEmail.textContent = "El correo es obligatorio."; isValid = false; }
        else {
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                errEmail.textContent = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                isValid = false;
            } else if (usersList.some(u => u.email === emailVal && u.run !== user.run)) {
                errEmail.textContent = "Este correo ya está registrado por otro usuario.";
                isValid = false;
            }
        }
        if (!regionIn.value) { errRegion.textContent = "Región requerida."; isValid = false; }
        if (!comunaIn.value) { errComuna.textContent = "Comuna requerida."; isValid = false; }
        if (isValid) {
            user.role = roleIn.value;
            user.name = nameIn.value.trim();
            user.lastname = lastnameIn.value.trim();
            user.email = emailVal;
            user.region = regionIn.value;
            user.comuna = comunaIn.value;
            localStorage.setItem("huerto_users_catalog", JSON.stringify(usersList));
            alert("¡Usuario modified con éxito!");
            window.location.href = "usuariosAdmin.html";
        }
    });
}

// ==========================================================================
/* VALIDACIÓN DE REGISTRO PÚBLICO DE CLIENTES (registro.html) */
// ==========================================================================
function initClientRegisterPage() {
    const registerForm = document.getElementById("form-user-register");
    if (!registerForm) return;

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const runIn = document.getElementById("reg-run");
        const nameIn = document.getElementById("reg-name");
        const lastnameIn = document.getElementById("reg-lastname");
        const emailIn = document.getElementById("reg-email");
        const passIn = document.getElementById("reg-password");
        const confirmIn = document.getElementById("reg-confirm");
        const phoneIn = document.getElementById("reg-phone");
        const birthIn = document.getElementById("reg-birth");
        const regionIn = document.getElementById("user-region");
        const comunaIn = document.getElementById("user-comuna");
        const addressIn = document.getElementById("reg-address");

        const errRun = document.getElementById("error-reg-run");
        const errName = document.getElementById("error-reg-name");
        const errLastname = document.getElementById("error-reg-lastname");
        const errEmail = document.getElementById("error-reg-email");
        const errPass = document.getElementById("error-reg-password");
        const errConfirm = document.getElementById("error-reg-confirm");
        const errRegion = document.getElementById("error-user-region");
        const errComuna = document.getElementById("error-user-comuna");
        const errAddress = document.getElementById("error-reg-address");

        const errorElements = [errRun, errName, errLastname, errEmail, errPass, errConfirm, errRegion, errComuna, errAddress];
        errorElements.forEach(el => { if (el) el.textContent = ""; });

        let isValid = true;
        const currentUsers = getStoredUsers();

        const runVal = runIn ? runIn.value.trim().toUpperCase() : "";
        if (!runVal) { if (errRun) errRun.textContent = "El RUN es obligatorio."; isValid = false; }
        else if (runVal.length < 7 || runVal.length > 9) { if (errRun) errRun.textContent = "Debe tener entre 7 y 9 caracteres."; isValid = false; }
        else if (currentUsers.some(u => u.run === runVal)) { if (errRun) errRun.textContent = "Este RUN ya está registrado."; isValid = false; }

        if (nameIn && !nameIn.value.trim()) { if (errName) errName.textContent = "El nombre es obligatorio."; isValid = false; }
        if (lastnameIn && !lastnameIn.value.trim()) { if (errLastname) errLastname.textContent = "El apellido es obligatorio."; isValid = false; }

        const emailVal = emailIn ? emailIn.value.trim().toLowerCase() : "";
        if (!emailVal) { if (errEmail) errEmail.textContent = "El correo es obligatorio."; isValid = false; }
        else {
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                if (errEmail) errEmail.textContent = "Solo correos @inacap.cl, @profesor.inacap.cl o @gmail.com.";
                isValid = false;
            } else if (currentUsers.some(u => u.email === emailVal)) {
                if (errEmail) errEmail.textContent = "Este correo electrónico ya está registrado.";
                isValid = false;
            }
        }

        const passVal = passIn ? passIn.value : "";
        if (!passVal) { if (errPass) errPass.textContent = "La contraseña es obligatoria."; isValid = false; }
        else if (passVal.length < 4 || passVal.length > 12) { if (errPass) errPass.textContent = "Debe tener entre 4 y 12 caracteres."; isValid = false; }

        const confirmVal = confirmIn ? confirmIn.value : "";
        if (!confirmVal) { if (errConfirm) errConfirm.textContent = "Confirme su contraseña."; isValid = false; }
        else if (passVal !== confirmVal) { if (errConfirm) errConfirm.textContent = "Las contraseñas no coinciden."; isValid = false; }

        if (regionIn && !regionIn.value) { if (errRegion) errRegion.textContent = "Región requerida."; isValid = false; }
        if (comunaIn && !comunaIn.value) { if (errComuna) errComuna.textContent = "Comuna requerida."; isValid = false; }
        if (addressIn && !addressIn.value.trim()) { if (errAddress) errAddress.textContent = "La dirección es obligatoria."; isValid = false; }

        if (isValid) {
            const newClient = {
                run: runVal,
                role: "Cliente",
                name: nameIn.value.trim(),
                lastname: lastnameIn.value.trim(),
                email: emailVal,
                password: passVal,
                phone: phoneIn ? phoneIn.value.trim() : "",
                birthDate: birthIn ? birthIn.value : "",
                region: regionIn.value,
                comuna: comunaIn.value,
                address: addressIn ? addressIn.value.trim() : ""
            };
            currentUsers.push(newClient);
            localStorage.setItem("huerto_users_catalog", JSON.stringify(currentUsers));
            alert("¡Usuario registrado de manera exitosa! Ya puedes iniciar sesión.");
            window.location.href = "login.html";
        }
    });
}

// ==========================================================================
/* 🌟 NUEVO: PROCESAMIENTO DE INICIO DE SESIÓN COMPARTIDO (login.html) */
// ==========================================================================
function initLoginPage() {
    const loginForm = document.getElementById("form-user-login");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita recargas inesperadas

        const emailIn = document.getElementById("login-email");
        const passIn = document.getElementById("login-password");

        const errEmail = document.getElementById("error-login-email");
        const errPass = document.getElementById("error-login-password");

        // Limpieza de alertas previas
        if (errEmail) errEmail.textContent = "";
        if (errPass) errPass.textContent = "";

        let isValid = true;
        const users = getStoredUsers(); // Levanta base de datos limpia

        if (!emailIn || !emailIn.value.trim()) {
            if (errEmail) errEmail.textContent = "El correo electrónico es obligatorio.";
            isValid = false;
        }
        if (!passIn || !passIn.value) {
            if (errPass) errPass.textContent = "La contraseña es obligatoria.";
            isValid = false;
        }

        if (!isValid) return;

        const emailVal = emailIn.value.trim().toLowerCase();
        const passVal = passIn.value;

        // Buscamos coincidencia exacta de correo
        const matchedUser = users.find(u => u.email === emailVal);

        if (!matchedUser) {
            if (errEmail) errEmail.textContent = "Este correo electrónico no se encuentra registrado.";
            return;
        }

        // Validamos la clave asociada
        if (matchedUser.password !== passVal) {
            if (errPass) errPass.textContent = "La contraseña introducida es incorrecta.";
            return;
        }

        // Si las credenciales coinciden, guardamos la sesión activa en LocalStorage
        localStorage.setItem("huerto_active_session", JSON.stringify(matchedUser));

        alert(`¡Bienvenido/a de vuelta, ${matchedUser.name}!`);

        // 🌟 CORREGIDO: Caminos de rutas relativas según tus carpetas reales
        if (matchedUser.role === "Administrador" || matchedUser.role === "Vendedor") {
            // Sale de la carpeta actual (auth) y entra a la carpeta admin
            window.location.href = "../admin/homeAdmin.html"; 
        } else {
            // Sale de componentes, sale de src y va al index principal de la raíz
            window.location.href = "../../../index.html"; 
        }
    });
}

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

function setupRegionesYComunas(idRegion, idComuna) {
    const selectRegion = document.getElementById(idRegion);
    const selectComuna = document.getElementById(idComuna);
    if (!selectRegion || !selectComuna) return;
    selectRegion.innerHTML = '<option value="">-- Seleccione Región --</option>';
    Object.keys(chileUbicaciones).forEach(region => {
        const opt = document.createElement("option");
        opt.value = region;
        opt.textContent = region;
        selectRegion.appendChild(opt);
    });
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
            selectComuna.innerHTML = '<option value="">-- Primero elija una region --</option>';
        }
    });
}

// ==========================================================================
/* CONTROL DE CARGA CENTRALIZADO ÚNICO GATILLADO AL INICIO */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initStoreMap();
    if (document.getElementById("admin-products-table-body")) {
        renderAdminProductsTable();
    }
    if (document.getElementById("admin-users-table-body")) {
        renderAdminUsersTable();
    }
    initAddProductPage();
    initEditProductPage();
    
    if (document.getElementById("form-admin-add-user")) {
        setupRegionesYComunas("user-region", "user-comuna");
        initAddUserPage();
    }
    if (document.getElementById("form-admin-edit-user")) {
        setupRegionesYComunas("edit-user-region", "edit-user-comuna");
        initEditUserPage();
    }
    if (document.getElementById("form-user-register")) {
        setupRegionesYComunas("user-region", "user-comuna");
        initClientRegisterPage();
    }
    // 🌟 ENGANCHE LOGIN: Despierta cuando se cargue login.html
    if (document.getElementById("form-user-login")) {
        initLoginPage();
    }
});