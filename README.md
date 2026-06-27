# 🥑 HuertoHogar - Del Campo al Hogar

HuertoHogar es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile[cite: 2]. Con más de 6 años de experiencia, operamos en más de 9 puntos a lo largo del país, incluyendo ciudades clave como Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar, Valparaíso y Concepción[cite: 2]. Nuestra misión es conectar a las familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible[cite: 2].

Este sistema web fue desarrollado de manera integral como parte de la **Evaluación 2** para la asignatura de Desarrollo Web en **INACAP**.

---

## 🚀 Características del Proyecto

El sistema está estructurado bajo una arquitectura semántica y dividida en dos grandes módulos:

### 🛒 Módulo Público (Tienda Online)
* **Página Principal (Home):** Cuenta con un menú de navegación centralizado, la información e imagen de la tienda y una lista de productos destacados con su respectiva imagen, nombre y precio[cite: 1].
* **Catálogo de Ventas (`productos.html`):** Listado completo de abarrotes automatizado mediante JavaScript que implementa filtros por categoría (Frutas Frescas, Verduras Orgánicas, Productos Orgánicos y Productos Lácteos)[cite: 1, 2].
* **Ficha de Detalle (`detalle.html`):** Detalla el contenido específico de cada producto, validando las existencias máximas en inventario y desplegando un carrusel inferior con productos relacionados[cite: 1].
* **Carrito de Compras (`carrito.html` y `pago.html`):** Implementación de una bolsa de compras persistente en `localStorage`[cite: 1]. Incluye contador dinámico en el encabezado, controles de incremento y decremento, aplicación del cupón promocional **`INACAP20`** (20% de descuento) y una simulación intermedia de pasarela de pago segura mediante Webpay[cite: 1].

### ⚙️ Módulo de Gestión (Panel Administrativo)
* **Mantenedores CRUD:** Tablas dinámicas y formularios para la administración de Productos y Usuarios (creación, lectura, actualización y eliminación)[cite: 1].
* **Validación en Tiempo Real:** JavaScript dedicado a capturar errores en formularios bajo estrictas reglas de negocio (formatos de RUT sin puntos ni guiones, extensiones de caracteres y restricción de correos a dominios institucionales)[cite: 1].
* **Ubicaciones Dinámicas:** Sistema reactivo que actualiza el listado secundario de comunas chilenas de forma automática al cambiar la región seleccionada[cite: 1].

---

## 🎨 Especificaciones de Diseño Visual

El diseño refleja frescura y naturalidad, facilitando una navegación intuitiva para el usuario[cite: 2]:
* **Color de Fondo Principal:** Blanco Suave (`#F7F7F7`) para destacar el contenido visual[cite: 2].
* **Color de Acento Interactivos:** Verde Esmeralda (`#2E8B57`) para botones y enlaces interactivos, simbolizando naturaleza[cite: 2].
* **Color de Ofertas y Promociones:** Amarillo Mostaza (`#FFD700`) para resaltar la aplicación de descuentos y cupones[cite: 2].
* **Tipografías:** *Montserrat* como fuente principal para texto general y *Playfair Display* para encabezados y títulos elegantes[cite: 2].

---

## 📂 Estructura del Directorio del Proyecto

```text
huerto-hogar/
│
├── index.html                   # Página Principal de la Raíz (Home)
├── README.md                    # Presentación institucional del repositorio
├── .gitignore                   # Exclusión de archivos temporales de Git
│
└── src/
    ├── assets/
    │   └── images/              # Recursos gráficos (HuertoHogar-Logo.jpg)
    │
    ├── components/
    │   ├── admin/               # Vista de gestión (productosAdmin, usuariosAdmin, etc.)
    │   └── tienda/              # Vistas públicas de la tienda (productos, detalle, carrito, pago, etc.)
    │
    ├── css/
    │   ├── style.css            # Hoja de estilos global y responsiva del sitio
    │   ├── admin.css            # Estilos del panel de gestión
    │   ├── auth.css             # Estilos de login y registro
    │   ├── blog.css             # Estilos de la sección educativa
    │   ├── contacto.css         # Estilos del formulario de contacto
    │   └── detalleblog.css      # Estilos de lecturas individuales
    │
    └── js/
        ├── main.js              # Cerebro dinámico de la tienda y lógica del carrito
        ├── validaciones.js      # Captura de errores de formularios en tiempo real
        └── productos.JSON       # proximo paso para modularizar el codigo y dejar ahi los productos