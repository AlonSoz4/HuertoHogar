// ==========================================================================
/* CONTROL DE INICIO DE SESIÓN Y REDIRECCIÓN INTERACTIVA (login.html) */
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("form-user-login");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            // Evitamos que la página se recargue por defecto para poder validar con JS
            e.preventDefault(); 

            // Capturamos los elementos de entrada de datos
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");
            
            // Capturamos los contenedores de error del HTML para inyectar los mensajes
            const errorEmail = document.getElementById("error-login-email");
            const errorPassword = document.getElementById("error-login-password");

            // Limpiamos mensajes de errores de intentos previos
            errorEmail.textContent = "";
            errorPassword.textContent = "";

            let isFormValid = true;

            // 1. VALIDACIÓN DEL CAMPO DE CORREO (Requerimientos oficiales de INACAP)
            const emailValue = emailInput.value.trim();
            if (!emailValue) {
                errorEmail.textContent = "El correo electrónico es requerido.";
                isFormValid = false;
            } else if (emailValue.length > 100) {
                errorEmail.textContent = "El correo no puede superar los 100 caracteres.";
                isFormValid = false;
            } else {
                // Expresión regular estricta para validar los 3 dominios permitidos por el cliente
                const allowedDomains = /^[a-zA-Z0-9._%+-]+@(inacap\.cl|inacapmail\.cl|gmail\.com)$/;
                if (!allowedDomains.test(emailValue)) {
                    errorEmail.textContent = "Solo se permiten dominios @inacap.cl, @inacapmail.cl o @gmail.com.";
                    isFormValid = false;
                }
            }

            // 2. VALIDACIÓN DEL CAMPO DE CONTRASEÑA (Requerimientos oficiales de INACAP)
            const passwordValue = passwordInput.value;
            const passLength = passwordValue.length;
            if (!passwordValue) {
                errorPassword.textContent = "La contraseña es requerida.";
                isFormValid = false;
            } else if (passLength < 4 || passLength > 10) {
                errorPassword.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
                isFormValid = false;
            }

            // 3. REDIRECCIÓN INTELIGENTE SEGÚN EL ROL (Simulación para el examen)
            if (isFormValid) {
                const emailLower = emailValue.toLowerCase();

                // Credenciales exclusivas para ingresar al Backoffice como Administrador
                if (emailLower === "admin@inacap.cl" && passwordValue === "1234") {
                    alert("¡Autenticación exitosa como ADMINISTRADOR! Ingresando al Backoffice.");
                    // Sube un nivel desde 'tienda/' y entra a 'admin/' respetando las mayúsculas CamelCase
                    window.location.href = "../admin/homeAdmin.html";
                } 
                // Flujo para cualquier otro correo válido que actúe como cliente común
                else {
                    alert("¡Autenticación exitosa como CLIENTE! Ingresando a la Tienda Pública.");
                    // Sube tres niveles de carpetas hasta llegar al index.html en la raíz del proyecto
                    window.location.href = "../../../index.html";
                }
            }
        });
    }
});

// ==========================================================================
/* CONTROL DE REGISTRO PÚBLICO DE LA TIENDA (registro.html) */
// ==========================================================================
// ... (Aquí van tus validaciones normales de campos de registro de la tienda) ...

if (isFormValid) {
    // 1. Rescatamos la lista de usuarios que ya existe en el LocalStorage
    // Usamos exactamente la misma llave del administrador
    const storedUsersJson = localStorage.getItem("huerto_users_catalog");
    let currentUsers = [];

    if (storedUsersJson) {
        currentUsers = JSON.parse(storedUsersJson);
    } else {
        // Si por alguna razón está vacío, podemos dejar por defecto las cuentas base
        currentUsers = [
            { run: "19011022K", name: "Administrador", lastname: "Huerto Hogar", email: "admin@inacap.cl", role: "Administrador", region: "RM", comuna: "Santiago", address: "Av. España 450" }
        ];
    }

    // 2. Capturamos los datos del nuevo cliente que se está registrando en la tienda
    const newClient = {
        run: document.getElementById("reg-run").value.trim().toUpperCase(), // Si pides RUN
        name: document.getElementById("reg-name").value.trim(),
        lastname: document.getElementById("reg-lastname").value.trim(),
        email: document.getElementById("reg-email").value.trim().toLowerCase(),
        role: "Cliente", // <-- REGLA DE ORO: Todo registro público entra automáticamente con rol Cliente
        region: document.getElementById("reg-region").value,
        comuna: document.getElementById("reg-comuna").value,
        address: document.getElementById("reg-address").value.trim()
    };

    // 3. Validamos rápidamente que el RUN o Correo no existan previamente
    if (currentUsers.some(u => u.run === newClient.run)) {
        alert("Este RUN ya se encuentra registrado.");
        return;
    }
    if (currentUsers.some(u => u.email === newClient.email)) {
        alert("Este correo electrónico ya está en uso.");
        return;
    }

    // 4. Lo empujamos al arreglo y lo guardamos en la misma llave compartida
    currentUsers.push(newClient);
    localStorage.setItem("huerto_users_catalog", JSON.stringify(currentUsers));

    alert("¡Registro completado con éxito! Bienvenido a HuertoHogar.");
    
    // Redireccionamos al login para que inicie sesión con su nueva cuenta
    window.location.href = "login.html"; 
}