// src/utils/persistencia.js

// 1. Carrito (Guía 14, Sección 6)
export function guardarCarrito(datos) {
  localStorage.setItem("carrito_los_maestros", JSON.stringify(datos));
}

export function obtenerCarrito() {
  const guardados = localStorage.getItem("carrito_los_maestros");
  return guardados ? JSON.parse(guardados) : [];
}

// 2. Sesión de Usuario (Admin, Vendedor, Cliente)
export function obtenerSesion() {
  const sesion = localStorage.getItem("usuario_sesion");
  return sesion ? JSON.parse(sesion) : null;
}

export function guardarSesion(usuario) {
  localStorage.setItem("usuario_sesion", JSON.stringify(usuario));
}

export function cerrarSesionStorage() {
  localStorage.removeItem("usuario_sesion");
}

// 3. Historial de Órdenes del Cliente
export function obtenerOrdenesCliente() {
  const guardadas = localStorage.getItem("ordenes_compras_cliente");
  return guardadas ? JSON.parse(guardadas) : [];
}

export function guardarOrdenCliente(nuevaOrden) {
  const previas = obtenerOrdenesCliente();
  localStorage.setItem(
    "ordenes_compras_cliente",
    JSON.stringify([nuevaOrden, ...previas])
  );
}