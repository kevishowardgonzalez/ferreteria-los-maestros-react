# 🔨 Ferretería Los Maestros — Tienda Online y Panel de Gestión

Proyecto académico desarrollado para la asignatura **Desarrollo FullStack II (DSY1104)** de Duoc UC.

---

## 👥 Integrantes del Equipo

* **Kevis González**
* **Yerickson Rodríguez**
* **Javier Cruz**

---

## 📖 Descripción del Proyecto

Plataforma web integral para **Ferretería Los Maestros**, empresa familiar de La Serena con más de 22 años de experiencia en la comercialización de materiales de construcción, herramientas y ferretería general.

El sistema implementa:

* **Tienda pública:** Catálogo de productos con miniaturas y detalles, ficha de producto con selector de cantidad, carrito de compras con persistencia mediante `LocalStorage`, blogs técnicos y formularios con accesibilidad.
* **Módulo administrativo (`admin/`):** Dashboard con métricas de stock crítico, mantenedores de inventario y control de acceso según roles: Administrador, Vendedor y Cliente.
* **Validaciones JavaScript:** Algoritmo Módulo 11 para validación de RUN chileno, dominios autorizados (`@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`) y selects dinámicos dependientes de Región y Comuna.
* **Frontend:** Aplicación desarrollada utilizando **React** y **Vite**, con componentes reutilizables y una estructura organizada para facilitar el mantenimiento y crecimiento del proyecto.

---

## 🛠️ Tecnologías Utilizadas

* **React**
* **Vite**
* **JavaScript**
* **HTML5**
* **CSS3**
* **LocalStorage**
* **Git**
* **GitHub**
* **Visual Studio Code**

---

## 📁 Estructura del Proyecto

```text
Ferreteria-Los-Maestros-React/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/kevishowardgonzalez/ferreteria-los-maestros-react.git
```

### 2. Ingresar al proyecto

```bash
cd ferreteria-los-maestros-react
```

### 3. Instalar las dependencias

Usa Node.js 24 y npm 11. El proyecto utiliza React 19, Vite 8 y Vitest 4.

```bash
npm ci
```

Usa `.env.example` como referencia para configurar las URL base en `.env.local`.
Los valores `VITE_` son públicos y contienen únicamente direcciones, sin
credenciales ni rutas de endpoints. Autoriza el origen de Vite mediante
`APP_CORS_ALLOWED_ORIGIN` en los servicios Spring.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

### 5. Abrir el proyecto

Vite mostrará en la consola una dirección similar a:

```text
http://localhost:5173/
```

Abrir esa dirección en el navegador para visualizar la aplicación.

---

## 📦 Scripts Disponibles

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

### Generar versión para producción

```bash
npm run build
```

### Previsualizar la versión de producción

```bash
npm run preview
```

### Pruebas y lint

```bash
npm run test:run -- --maxWorkers=2
npx --no-install oxlint
```

---

## 🔐 Roles del Sistema

El sistema contempla los siguientes roles:

* **Administrador:** Gestiona productos, categorías y fichas de Inventario. Registra movimientos y consulta el historial.
* **Vendedor:** Consulta el catálogo y el listado de Inventario. Las escrituras y el historial de movimientos son exclusivos de ADMIN.
* **Cliente:** Acceso a la tienda, productos y carrito de compras.

### Catálogo, seguridad e Inventario

Inicia Auth (8081), Categorías (8084), Productos (8085) e Inventario (8086)
para usar el catálogo y el panel. Los demás puertos son Usuarios 8082,
Roles 8083, Boletas 8087, Carrito 8088, Contacto 8089 y Foro 8090.
Cada servicio usa su propio esquema MySQL. Configura `JWT_SECRET` y
`JWT_ISSUER` en el backend y `PRODUCTOS_API_URL` en Inventario.
El [README del backend y su guía de SKU](https://github.com/kevishowardgonzalez/ferreteria-backend#10-instalación-y-ejecución)
detallan los permisos de la API y la actualización de bases existentes.

React usa `src/config/api.js` y `src/services/clienteHttp.js` para la comunicación
REST. `src/services/inventario.js` consulta el saldo público en
`/api/v1/inventario/producto/{id}` y envía el JWT en las operaciones protegidas.
Al dar de alta un producto, el panel crea el registro en Productos y luego la
ficha en Inventario. Si solo se completa el primer paso, el panel permite
recuperar la ficha pendiente.

La tienda usa `InventarioItem.stockActual` como disponibilidad oficial.
`Producto.stock` es un atributo legado. En el backend, el equipo autorizó
como técnicas adicionales el bloqueo pesimista de movimientos y la consulta
HTTP a Productos al registrar una ficha.

El backend aplica los permisos incluso si se modifica el rol local. El JWT
de una sesión cerrada sigue vigente hasta su expiración. El carrito conserva
cantidades en almacenamiento local. La siguiente etapa conectará carrito,
compras y boletas y revalidará existencias al confirmar la venta.

## Despliegue en AWS

La aplicación Ferretería Los Maestros se desplegó en
Amazon EC2 utilizando Ubuntu y Nginx.

### Tecnologías
- React + Vite
- AWS EC2
- Ubuntu Server
- Nginx
- SSH y SCP

### Pasos principales
1. Ejecutar `npm run build`.
2. Crear una instancia EC2 con Ubuntu.
3. Configurar los puertos SSH (22) y HTTP (80).
4. Instalar Nginx en Ubuntu.
5. Copiar la carpeta `dist` al servidor.
6. Publicar los archivos en `/var/www/ferreteria-los-maestros`.
7. Activar la configuración de `deploy/nginx.conf`.
8. Verificar el sitio y las rutas de React Router.

### Verificación
- Build de producción exitoso.
- Sitio publicado mediante AWS EC2 y Nginx.
- Pruebas unitarias: 36 aprobadas.

Nota: La dirección IP pública puede cambiar al reiniciar EC2.


---

## 👨‍💻 Proyecto Académico

**Asignatura:** Desarrollo FullStack II
**Código:** DSY1104
**Institución:** Duoc UC

**Proyecto:** Ferretería Los Maestros

