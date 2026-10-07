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

```bash
npm install
```

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

---

## 🔐 Roles del Sistema

El sistema contempla los siguientes roles:

* **Administrador:** Gestión completa del sistema y productos.
* **Vendedor:** Gestión relacionada con ventas e inventario.
* **Cliente:** Acceso a la tienda, productos y carrito de compras.

---

## 👨‍💻 Proyecto Académico

**Asignatura:** Desarrollo FullStack II
**Código:** DSY1104
**Institución:** Duoc UC

**Proyecto:** Ferretería Los Maestros
