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
    { code: "FR001", category: "Frutas Frescas", name: "Manzanas Fuji", price: 1200, stock: 150, criticalStock: 10, description: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables." },
    { code: "FR002", category: "Frutas Frescas", name: "Naranjas Valencia", price: 1000, stock: 200, criticalStock: 10, description: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes." },
    { code: "FR003", category: "Frutas Frescas", name: "Plátanos Cavendish", price: 800, stock: 250, criticalStock: 10, description: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Ricos en potasio." },
    { code: "VR001", category: "Verduras Orgánicas", name: "Zanahorias Orgánicas", price: 900, stock: 100, criticalStock: 10, description: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A." },
    { code: "VR002", category: "Verduras Orgánicas", name: "Espinacas Frescas", price: 700, stock: 80, criticalStock: 10, description: "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Cultivadas bajo prácticas orgánicas." },
    { code: "VR003", category: "Verduras Orgánicas", name: "Pimientos Tricolores", price: 1500, stock: 120, criticalStock: 10, description: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes." },
    { code: "PO001", category: "Productos Orgánicos", name: "Miel Orgánica", price: 5000, stock: 50, criticalStock: 10, description: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable." },
    { code: "PO003", category: "Productos Orgánicos", name: "Quinua Orgánica", price: 2400, stock: 0, criticalStock: 10, description: "Quinua orgánica de alta calidad, ideal para acompañamientos saludables y ensaladas ricas en proteínas." },
    { code: "PL001", category: "Productos Lácteos", name: "Leche Entera", price: 1100, stock: 0, criticalStock: 10, description: "Leche entera fresca proveniente de granjas locales dedicadas a la producción responsable." }
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
/* RENDERIZADO INTERACTIVO DE LA PÁGINA DEL CARRITO (carrito.html) CORREGIDO */
// ==========================================================================
function renderCartPage() {
    const itemsWrapper = document.getElementById("cart-items-wrapper");
    const totalAmountEl = document.getElementById("cart-total-amount");
    if (!itemsWrapper) return;
    
    const cart = getCartItems();
    itemsWrapper.innerHTML = "";
    
    if (cart.length === 0) {
        itemsWrapper.innerHTML = `<p style="text-align:center; padding: 40px; color:#666;">Tu carrito de compras está vacío.</p>`;
        if (totalAmountEl) totalAmountEl.textContent = "$0 CLP";
        return;
    }
    
    let subtotalGeneral = 0;
    
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotalGeneral += itemSubtotal;
        
        let unidadLabel = "unidades";
        if (item.category === "Frutas Frescas" || item.name.includes("Zanahorias") || item.name.includes("Pimientos") || item.name.includes("Quinua")) {
            unidadLabel = "kg";
        } else if (item.name.includes("Espinacas")) {
            unidadLabel = "bolsas";
        } else if (item.name.includes("Miel")) {
            unidadLabel = "frascos";
        } else if (item.category === "Productos Lácteos") {
            unidadLabel = "litros";
        }

        // 🌟 DETECTAR RUTA CORRECTA: Evita caídas silenciosas según la página donde esté parado el cliente
        let logoPath = "../../assets/images/HuertoHogar-Logo.jpg";
        if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/")) {
            logoPath = "./src/assets/images/HuertoHogar-Logo.jpg";
        }

        const cartItemRow = document.createElement("div");
        cartItemRow.className = "cart-item-row";
        cartItemRow.style = "display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #eee; gap: 15px;";
        
        cartItemRow.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                <img src="${logoPath}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain; border-radius: 4px; background: #f9f9f9; border: 1px solid #eee;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #333; font-family: 'Montserrat', sans-serif;">${item.name}</h4>
                    <p style="margin: 0; font-size: 0.85rem; color: #666;">Precio: $${item.price.toLocaleString('es-CL')} / ${unidadLabel}</p>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
                <button type="button" onclick="updateCartItemQuantity('${item.code}', -1)" style="width:30px; height:30px; background:#e2e3e5; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">-</button>
                <span style="font-weight: bold; width: 25px; text-align: center; font-size: 1rem;">${item.quantity}</span>
                <button type="button" onclick="updateCartItemQuantity('${item.code}', 1)" style="width:30px; height:30px; background:#e2e3e5; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">+</button>
            </div>
            
            <div style="text-align: right; min-width: 120px;">
                <span style="font-weight: bold; color: #2E8B57; display: block; font-size: 1.05rem;">$${itemSubtotal.toLocaleString('es-CL')} CLP</span>
                <button type="button" onclick="removeProductFromCart('${item.code}')" style="background: none; border: none; color: #dc3545; font-size: 0.8rem; cursor: pointer; padding: 5px 0; text-decoration: underline;">Quitar</button>
            </div>
        `;
        itemsWrapper.appendChild(cartItemRow);
    });
    
    if (totalAmountEl) {
        totalAmountEl.textContent = `$${subtotalGeneral.toLocaleString('es-CL')} CLP`;
    }
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
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|inacapmail\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                errEmail.textContent = "Solo correos @inacap.cl, @inacapmail.cl, @profesor.inacap.cl o @gmail.com.";
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
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|inacapmail\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                errEmail.textContent = "Solo correos @inacap.cl, @inacapmail.cl, @profesor.inacap.cl o @gmail.com.";
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
            const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|inacapmail\.cl|profesor\.inacap\.cl|gmail\.com)$/;
            if (!allowedDomains.test(emailVal)) {
                if (errEmail) errEmail.textContent = "Solo correos @inacap.cl, @inacapmail.cl, @profesor.inacap.cl o @gmail.com.";
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
/* RENDERIZADO DINÁMICO DE PRODUCTOS EN LA TIENDA PÚBLICA (productos.html) */
// ==========================================================================
// ==========================================================================
/* RENDERIZADO DINÁMICO DE PRODUCTOS CON FILTRO POR CATEGORÍA (productos.html) */
// ==========================================================================
function renderPublicProducts(categoryFilter = "Todos") {
    const gridContainer = document.getElementById("public-products-grid");
    if (!gridContainer) return;
    
    const products = getStoredProducts();
    gridContainer.innerHTML = "";
    
    // 🌟 NUEVO: Aplicamos el filtro de categoría si es distinto a "Todos"
    const filteredProducts = categoryFilter === "Todos" 
        ? products 
        : products.filter(p => p.category === categoryFilter);
        
    if (filteredProducts.length === 0) {
        gridContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #666;">No hay productos disponibles en esta categoría.</p>`;
        return;
    }
    
    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        let unidad = "unidades";
        if (product.category === "Frutas Frescas" || product.name.includes("Zanahorias") || product.name.includes("Pimientos") || product.name.includes("Quinua")) {
            unidad = "kg";
        } else if (product.name.includes("Espinacas")) {
            unidad = "bolsas";
        } else if (product.name.includes("Miel")) {
            unidad = "frascos";
        } else if (product.category === "Productos Lácteos") {
            unidad = "litros";
        }
        
        const imagePath = "../../assets/images/HuertoHogar-Logo.jpg";
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${imagePath}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info-body">
                <span class="product-tag-cat">${product.category}</span>
                <h3 class="product-item-title">${product.name}</h3>
                <p class="product-item-code">Código: ${product.code}</p>
                <div class="product-meta-row">
                    <span class="product-item-price">$${product.price.toLocaleString('es-CL')} CLP</span>
                    <span class="product-item-stock ${product.stock === 0 ? 'no-stock' : ''}">
                        ${product.stock === 0 ? 'Agotado' : `Stock: ${product.stock} ${unidad}`}
                    </span>
                </div>
                <div class="product-actions-row" style="display: flex; gap: 10px; margin-top: 15px;">
                    <a href="detalle.html?code=${product.code}" class="btn-view-detail" style="text-decoration: none; text-align: center; flex: 1; padding: 10px; background-color: #e2e3e5; color: #333; border-radius: 4px; font-weight: 500; font-size: 0.9rem;">Ver Detalle</a>
                    <button type="button" class="btn-add-to-cart" onclick="handleQuickAddToCart('${product.code}')" ${product.stock === 0 ? 'disabled' : ''} style="flex: 1; padding: 10px; background-color: #2E8B57; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 0.9rem; cursor: pointer;">
                        ${product.stock === 0 ? 'Sin Stock' : 'Añadir  🛒 '}
                    </button>
                </div>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// ==========================================================================
/* 🌟 INTERACTIVIDAD DE CHECKBOXES MÚLTIPLES (productos.html) */
// ==========================================================================
function initCategoryFilters() {
    // Buscamos todas las casillas de verificación que tienen tu clase .catalog-filter
    const checkboxes = document.querySelectorAll(".catalog-filter");
    if (checkboxes.length === 0) return;

    // Escuchamos cuando el usuario marca o desmarca cualquiera de las casillas
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            // Creamos un arreglo con los valores de los checkboxes que SÍ están marcados
            const activeCategories = Array.from(checkboxes)
                .filter(chk => chk.checked)
                .map(chk => chk.value);
            
            // Re-renderizamos la vitrina enviando la lista de categorías activas
            renderFilteredPublicProducts(activeCategories);
        });
    });
}

// Nueva función de apoyo para renderizar múltiples categorías seleccionadas
function renderFilteredPublicProducts(activeCategories) {
    const gridContainer = document.getElementById("public-products-grid");
    if (!gridContainer) return;
    
    const products = getStoredProducts();
    gridContainer.innerHTML = "";
    
    // Si el usuario desmarcó TODO, mostramos un aviso amigable
    if (activeCategories.length === 0) {
        gridContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #666;">Selecciona al menos una categoría para mostrar productos.</p>`;
        return;
    }
    
    // Filtramos los productos cuya categoría esté dentro de la lista de seleccionados
    const filteredProducts = products.filter(p => activeCategories.includes(p.category));
        
    if (filteredProducts.length === 0) {
        gridContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #666;">No hay productos disponibles en las categorías seleccionadas.</p>`;
        return;
    }
    
    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        let unidad = "unidades";
        if (product.category === "Frutas Frescas" || product.name.includes("Zanahorias") || product.name.includes("Pimientos") || product.name.includes("Quinua")) {
            unidad = "kg";
        } else if (product.name.includes("Espinacas")) {
            unidad = "bolsas";
        } else if (product.name.includes("Miel")) {
            unidad = "frascos";
        } else if (product.category === "Productos Lácteos") {
            unidad = "litros";
        }
        
        const imagePath = "../../assets/images/HuertoHogar-Logo.jpg";
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${imagePath}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info-body">
                <span class="product-tag-cat">${product.category}</span>
                <h3 class="product-item-title">${product.name}</h3>
                <p class="product-item-code">Código: ${product.code}</p>
                <div class="product-meta-row">
                    <span class="product-item-price">$${product.price.toLocaleString('es-CL')} CLP</span>
                    <span class="product-item-stock ${product.stock === 0 ? 'no-stock' : ''}">
                        ${product.stock === 0 ? 'Agotado' : `Stock: ${product.stock} ${unidad}`}
                    </span>
                </div>
                <div class="product-actions-row" style="display: flex; gap: 10px; margin-top: 15px;">
                    <a href="detalle.html?code=${product.code}" class="btn-view-detail" style="text-decoration: none; text-align: center; flex: 1; padding: 10px; background-color: #e2e3e5; color: #333; border-radius: 4px; font-weight: 500; font-size: 0.9rem;">Ver Detalle</a>
                    <button type="button" class="btn-add-to-cart" onclick="handleQuickAddToCart('${product.code}')" ${product.stock === 0 ? 'disabled' : ''} style="flex: 1; padding: 10px; background-color: #2E8B57; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 0.9rem; cursor: pointer;">
                        ${product.stock === 0 ? 'Sin Stock' : 'Añadir 🛒'}
                    </button>
                </div>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

function renderFeaturedProducts() {
    const featuredContainer = document.getElementById("featured-products-grid");
    if (!featuredContainer) return;

    const products = getStoredProducts();
    featuredContainer.innerHTML = "";

    // Para el Home, mostramos solo los primeros 4 productos como "Destacados"
    const featuredList = products.slice(0, 4);

    if (featuredList.length === 0) {
        featuredContainer.innerHTML = `<p style="text-align:center; width: 100%; padding: 20px;">No hay productos destacados disponibles.</p>`;
        return;
    }

    featuredList.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        let unidad = "unidades";
        if (product.category === "Frutas Frescas" || product.name.includes("Zanahorias") || product.name.includes("Pimientos") || product.name.includes("Quinua")) {
            unidad = "kg";
        } else if (product.name.includes("Espinacas")) {
            unidad = "bolsas";
        } else if (product.name.includes("Miel")) {
            unidad = "frascos";
        } else if (product.category === "Productos Lácteos") {
            unidad = "litros";
        }

        // 🌟 NOTA DE RUTA: Como index.html está en la raíz, bajamos un nivel menos en la ruta de las imágenes y enlaces
        const imagePath = "./src/assets/images/HuertoHogar-Logo.jpg";
        
        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${imagePath}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info-body">
                <span class="product-tag-cat">${product.category}</span>
                <h3 class="product-item-title">${product.name}</h3>
                <p class="product-item-code">Código: ${product.code}</p>
                <div class="product-meta-row">
                    <span class="product-item-price">$${product.price.toLocaleString('es-CL')} CLP</span>
                    <span class="product-item-stock ${product.stock === 0 ? 'no-stock' : ''}">
                        ${product.stock === 0 ? 'Agotado' : `Stock: ${product.stock} ${unidad}`}
                    </span>
                </div>
                <div class="product-actions-row" style="display: flex; gap: 10px; margin-top: 15px;">
                    <a href="./src/components/tienda/detalle.html?code=${product.code}" class="btn-view-detail" style="text-decoration: none; text-align: center; flex: 1; padding: 10px; background-color: #e2e3e5; color: #333; border-radius: 4px; font-weight: 500; font-size: 0.9rem;">Ver Detalle</a>
                    <button type="button" class="btn-add-to-cart" onclick="handleQuickAddToCart('${product.code}')" ${product.stock === 0 ? 'disabled' : ''} style="flex: 1; padding: 10px; background-color: #2E8B57; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 0.9rem; cursor: pointer;">
                        ${product.stock === 0 ? 'Sin Stock' : 'Añadir 🛒'}
                    </button>
                </div>
            </div>
        `;
        featuredContainer.appendChild(card);
    });
}

// ==========================================================================
/* LÓGICA PARA LA VISTA DETALLE DE PRODUCTO PÚBLICA (detalle.html) */
// ==========================================================================
function initProductDetailPage() {
    const detailWrapper = document.getElementById("product-detail-wrapper");
    if (!detailWrapper) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get("code");

    if (!productCode) {
        window.location.href = "productos.html";
        return;
    }

    const catalog = getStoredProducts();
    const product = catalog.find(p => p.code === productCode);

    if (!product) {
        alert("El producto seleccionado no existe.");
        window.location.href = "productos.html";
        return;
    }

    // Inyección de datos principales
    document.getElementById("detail-name").textContent = product.name;
    document.getElementById("detail-price").textContent = `$${product.price.toLocaleString('es-CL')} CLP`;
    document.getElementById("detail-desc").textContent = product.description || "";
    document.getElementById("detail-category").textContent = product.category;
    document.getElementById("detail-code").textContent = `Código: ${product.code}`;
    
    const stockEl = document.getElementById("detail-stock");
    if (stockEl) {
        let unidad = "unidades";
        if (product.category === "Frutas Frescas" || product.name.includes("Zanahorias") || product.name.includes("Pimientos") || product.name.includes("Quinua")) {
            unidad = "kg";
        } else if (product.name.includes("Espinacas")) {
            unidad = "bolsas";
        } else if (product.name.includes("Miel")) {
            unidad = "frascos";
        } else if (product.category === "Productos Lácteos") {
            unidad = "litros";
        }
        stockEl.textContent = product.stock === 0 ? "Agotado" : `Stock disponible: ${product.stock} ${unidad}`;
    }

    const selectQty = document.getElementById("detail-quantity-select");
    const btnAdd = document.getElementById("btn-detail-add-cart");
    
    if (selectQty) {
        selectQty.innerHTML = "";
        if (product.stock === 0) {
            selectQty.innerHTML = '<option value="0">0</option>';
            if (btnAdd) btnAdd.disabled = true;
        } else {
            const limit = Math.min(product.stock, 10);
            for (let i = 1; i <= limit; i++) {
                const opt = document.createElement("option");
                opt.value = i;
                opt.textContent = i;
                selectQty.appendChild(opt);
            }
        }
    }

    if (btnAdd) {
        // Clonamos para limpiar escuchadores previos si se recarga la función
        const newBtnAdd = btnAdd.cloneNode(true);
        btnAdd.parentNode.replaceChild(newBtnAdd, btnAdd);
        newBtnAdd.addEventListener("click", () => {
            const qty = parseInt(selectQty.value, 10);
            if (qty > 0) executeAddToCartLogic(product.code, qty);
        });
    }

    // ==========================================================================
    // 🌟 NUEVO: RENDERIZADO DE PRODUCTOS RELACIONADOS (PAUTA INACAP)
    // ==========================================================================
    const relatedContainer = document.getElementById("related-products-grid") || document.getElementById("related-grid-container");
    
    if (relatedContainer) {
        relatedContainer.innerHTML = "";
        
        // Filtramos productos de la misma categoría, excluyendo el que estamos viendo actualmente
        const related = catalog.filter(p => p.category === product.category && p.code !== product.code).slice(0, 4);
        
        if (related.length === 0) {
            relatedContainer.innerHTML = `<p style="color: #666; font-size: 0.9rem; padding: 20px;">No hay productos relacionados en esta categoría por ahora.</p>`;
        } else {
            related.forEach(item => {
                const itemCard = document.createElement("div");
                itemCard.className = "product-card"; // Usa tu clase CSS para que herede tus estilos de tarjeta
                
                const imagePath = "https://raw.githubusercontent.com/AlonSoz4/HuertoHogar/main/src/assets/images/HuertoHogar-Logo.jpg";
                
                itemCard.innerHTML = `
                    <div class="product-image-wrapper">
                        <img src="${imagePath}" alt="${item.name}" class="product-img" style="max-height: 120px; object-fit: contain; display: block; margin: 0 auto;">
                    </div>
                    <div class="product-info-body" style="padding: 10px; text-align: center;">
                        <h4 style="margin: 5px 0; font-size: 0.95rem; color: #333; font-family: 'Montserrat', sans-serif;">${item.name}</h4>
                        <p style="margin: 5px 0; font-weight: bold; color: #2E8B57; font-size: 0.9rem;">$${item.price.toLocaleString('es-CL')} CLP</p>
                        <a href="detalle.html?code=${item.code}" style="display: block; margin-top: 10px; padding: 6px; background: #e2e3e5; color: #333; text-decoration: none; font-size: 0.8rem; border-radius: 4px; font-weight: 500;">Ver Ficha</a>
                    </div>
                `;
                relatedContainer.appendChild(itemCard);
            });
        }
    }
}

// ==========================================================================
/* 🛒 MOTOR DEL CARRITO DE COMPRAS PURE JAVASCRIPT (LOCALSTORAGE) */
// ==========================================================================

function getCartItems() {
    const cart = localStorage.getItem("huerto_cart");
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(cart) {
    localStorage.setItem("huerto_cart", JSON.stringify(cart));
    updateCartHeaderCount();
}

// Sincroniza el número superior Cart (X) en vivo en cualquier página
function updateCartHeaderCount() {
    const cart = getCartItems();
    const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        cartCountEl.textContent = totalUnits;
    }
}

// Lógica de adición unificada basada en el catálogo local de JavaScript
function executeAddToCartLogic(code, quantity) {
    const catalog = getStoredProducts();
    const product = catalog.find(p => p.code === code);
    
    if (!product) return;
    
    // Regla de negocio: Validar existencias físicas en el inventario
    if (product.stock === 0) {
        alert("Lo sentimos, este producto se encuentra temporalmente agotado.");
        return;
    }
    
    let cart = getCartItems();
    const existingItem = cart.find(item => item.code === code);
    
    if (existingItem) {
        const nuevaCantidad = existingItem.quantity + quantity;
        if (nuevaCantidad > product.stock) {
            alert(`Límite de stock excedido. Solo quedan ${product.stock} unidades disponibles.`);
            return;
        }
        existingItem.quantity = nuevaCantidad;
    } else {
        if (quantity > product.stock) {
            alert(`No puedes agregar esa cantidad. El stock disponible es de ${product.stock}.`);
            return;
        }
        cart.push({
            code: product.code,
            name: product.name,
            price: product.price,
            category: product.category,
            quantity: quantity
        });
    }
    
    saveCartItems(cart);
    alert(`¡Añadido con éxito! Se incorporaron ${quantity} unidades de "${product.name}" al carrito.`);
    
    // 🌟 SOLO intenta renderizar la página del carro si el contenedor existe físicamente en la pantalla
    if (document.getElementById("cart-items-wrapper")) {
        renderCartPage();
    }
}

// Enlace directo para los botones de las tarjetas del catálogo y destacados
window.handleQuickAddToCart = (code) => { 
    executeAddToCartLogic(code, 1); 
};

// Controles interactivos (+) y (-) para la interfaz de carrito.html
window.updateCartItemQuantity = (code, change) => {
    let cart = getCartItems();
    const item = cart.find(i => i.code === code);
    if (!item) return;
    
    const catalog = getStoredProducts();
    const product = catalog.find(p => p.code === code);
    
    const nuevaQty = item.quantity + change;
    
    if (nuevaQty <= 0) {
        cart = cart.filter(i => i.code !== code);
    } else {
        if (product && nuevaQty > product.stock) {
            alert(`Límite alcanzado. Solo quedan ${product.stock} unidades en el inventario.`);
            return;
        }
        item.quantity = nuevaQty;
    }
    
    saveCartItems(cart);
    renderCartPage();
};

window.removeProductFromCart = (code) => {
    let cart = getCartItems();
    cart = cart.filter(item => item.code !== code);
    saveCartItems(cart);
    renderCartPage();
};

function initCheckoutLogic() {
    const btnApply = document.getElementById("btn-apply-coupon");
    const inputCoupon = document.getElementById("cart-coupon-input");
    const btnPay = document.getElementById("btn-cart-pay"); // Botón de carrito.html
    const btnConfirmPayment = document.getElementById("btn-confirm-final-payment"); // Botón de pago.html
    
    // 1. Inyección del total en la pantalla de Pago si es que existe el contenedor
    const checkoutTotalEl = document.getElementById("checkout-final-amount");
    if (checkoutTotalEl) {
        const cart = getCartItems();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Si el cliente aplicó el cupón antes, calculamos con el 20% si corresponde o el subtotal puro
        checkoutTotalEl.textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;
    }

    // Manejo de cupones en el carro
    if (btnApply && inputCoupon) {
        btnApply.addEventListener("click", () => {
            const couponText = inputCoupon.value.trim().toUpperCase();
            if (couponText === "INACAP20") {
                const totalAmountEl = document.getElementById("cart-total-amount");
                const currentItems = getCartItems();
                const subtotal = currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const descuento = subtotal * 0.20;
                const totalConDescuento = subtotal - descuento;
                
                if (totalAmountEl && subtotal > 0) {
                    totalAmountEl.innerHTML = `<span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">$${subtotal.toLocaleString('es-CL')}</span> <br> <span style="color: #2E8B57; font-weight: bold;">$${totalConDescuento.toLocaleString('es-CL')} CLP (20% Off)</span>`;
                    alert("¡Cupón 'INACAP20' aplicado de forma exitosa!");
                }
            } else {
                alert("El cupón ingresado no es válido.");
            }
        });
    }

    // ETAPA 1: Botón "PAGAR" en carrito.html -> Valida stock y redirige a la pasarela
    if (btnPay) {
        btnPay.addEventListener("click", () => {
            const cart = getCartItems();
            if (cart.length === 0) {
                alert("No tienes productos en tu carrito para procesar el pago.");
                return;
            }
            
            // Verificación preventiva de existencias antes de ir a pagar
            let catalog = getStoredProducts();
            let stockValido = true;
            let errorProduct = "";

            for (let item of cart) {
                const productInCatalog = catalog.find(p => p.code === item.code);
                if (!productInCatalog || productInCatalog.stock < item.quantity) {
                    stockValido = false;
                    errorProduct = item.name;
                    break;
                }
            }

            if (!stockValido) {
                alert(`Lo sentimos, el producto "${errorProduct}" no tiene suficiente stock disponible. Modifica las cantidades antes de continuar.`);
                return;
            }

            // Si el inventario es correcto, viaja a la pantalla intermedia de selección de tarjetas
            window.location.href = "pago.html";
        });
    }

    // ETAPA 2: Botón "CONFIRMAR TRANSACCIÓN" en pago.html -> Ejecuta el descuento real y vacía la bolsa
    if (btnConfirmPayment) {
        btnConfirmPayment.addEventListener("click", (e) => {
            e.preventDefault();
            
            // ... (aquí mantienes tu código de validación de radio buttons de tarjetas)

            const cart = getCartItems();
            let catalog = getStoredProducts();
            let criticalAlerts = []; // Guarda productos que entraron en riesgo

            cart.forEach(item => {
                const productInCatalog = catalog.find(p => p.code === item.code);
                if (productInCatalog) {
                    productInCatalog.stock -= item.quantity; // Descuento físico

                    // 🌟 REGLA DE NEGOCIO: Si el stock actual es igual o inferior al crítico, gatilla la alerta
                    if (productInCatalog.stock <= productInCatalog.criticalStock) {
                        criticalAlerts.push(`${productInCatalog.name} (Quedan: ${productInCatalog.stock} unidades)`);
                    }
                }
            });

            localStorage.setItem("huerto_products_catalog", JSON.stringify(catalog));

            // 🌟 DISPARADOR EN PANTALLA: Informa al administrador/vendedor el estado de alerta
            if (criticalAlerts.length > 0) {
                alert(`⚠️ ¡AVISO DE STOCK CRÍTICO DETECTADO! ⚠️\n\nLos siguientes productos han alcanzado o superado su límite mínimo de inventario:\n- ${criticalAlerts.join("\n- ")}\n\nPor favor, gestione la reposición en el panel administrativo.`);
            }

            alert("🔒 Transacción Procesada con Éxito mediante Webpay Simulado.\n\n¡Tu pedido ha sido confirmado! El stock fue rebajado del catálogo general y el despacho está en preparación.");
            localStorage.removeItem("huerto_cart");
            window.location.href = "productos.html";
        });
    }
}

// ==========================================================================
/* CONTROL DE CARGA CENTRALIZADO ÚNICO GATILLADO AL INICIO */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initStoreMap();
    if (document.getElementById("admin-products-table-body")) renderAdminProductsTable();
    if (document.getElementById("admin-users-table-body")) renderAdminUsersTable();
    initAddProductPage();
    initEditProductPage();
    if (document.getElementById("form-admin-add-user")) { setupRegionesYComunas("user-region", "user-comuna"); initAddUserPage(); }
    if (document.getElementById("form-admin-edit-user")) { setupRegionesYComunas("edit-user-region", "edit-user-comuna"); initEditUserPage(); }
    if (document.getElementById("form-user-register")) { setupRegionesYComunas("user-region", "user-comuna"); initClientRegisterPage(); }
    if (document.getElementById("form-user-login")) initLoginPage();
    
    // Enganches de visualización pública activos simultáneamente
    if (document.getElementById("public-products-grid")) renderPublicProducts();
    if (document.getElementById("product-detail-wrapper")) initProductDetailPage();
    if (document.getElementById("featured-products-grid")) renderFeaturedProducts();
    
    // Forzamos el conteo del carro en la barra superior al cargar cualquier sección
    updateCartHeaderCount();
    
    if (document.getElementById("cart-items-wrapper")) {
        renderCartPage();
        initCheckoutLogic();
    }
});



// ==========================================================================
/* CONTROL DE CARGA CENTRALIZADO ÚNICO GATILLADO AL INICIO */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initStoreMap(); // [cite: 426]
    
    if (document.getElementById("admin-products-table-body")) { // [cite: 427]
        renderAdminProductsTable(); // [cite: 428]
    }
    if (document.getElementById("admin-users-table-body")) { // [cite: 430]
        renderAdminUsersTable(); // [cite: 431]
    }
    initAddProductPage(); // [cite: 433]
    initEditProductPage(); // [cite: 434]
    
    if (document.getElementById("form-admin-add-user")) { // [cite: 436]
        setupRegionesYComunas("user-region", "user-comuna"); // [cite: 437]
        initAddUserPage(); // [cite: 438]
    }
    if (document.getElementById("form-admin-edit-user")) { // [cite: 440]
        setupRegionesYComunas("edit-user-region", "edit-user-comuna"); // [cite: 442]
        initEditUserPage(); // [cite: 443]
    }
    if (document.getElementById("form-user-register")) {
        setupRegionesYComunas("user-region", "user-comuna");
        initClientRegisterPage();
    }
    if (document.getElementById("form-user-login")) {
        initLoginPage();
    }
    
    // 🌟 NUEVOS ENGANCHES PÚBLICOS DE PRODUCTOS
    if (document.getElementById("public-products-grid")) {
        renderPublicProducts(); // Dibuja todos al principio
        initCategoryFilters();  // Activa el control de tus checkboxes
    }
    if (document.getElementById("product-detail-wrapper")) {
        initProductDetailPage();
    }
    // Busca esta sección al final de tu DOMContentLoaded y agrégale esta línea:
    if (document.getElementById("featured-products-grid")) {
        renderFeaturedProducts();
    }
});