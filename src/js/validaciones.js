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