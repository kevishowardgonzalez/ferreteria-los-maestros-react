import { sesionVigente } from "./sesion";

// src/utils/persistencia.js

// 1. Carrito (Guía 14, Sección 6)
export function guardarCarrito(datos) {
  localStorage.setItem("carrito_los_maestros", JSON.stringify(datos));
}

export function obtenerCarrito() {
  const guardados = localStorage.getItem("carrito_los_maestros");
  return guardados ? JSON.parse(guardados) : [];
}

// 2. Sesión de Usuario
const claveSesion = "usuario_sesion";

export function obtenerSesion() {
  try {
    const usuario = JSON.parse(sessionStorage.getItem(claveSesion));
    return sesionVigente(usuario) ? usuario : null;
  } catch {
    return null;
  }
}

export function guardarSesion({ token, id, nombre, apellido, correo, rol }) {
  sessionStorage.setItem(claveSesion, JSON.stringify({ token, id, nombre, apellido, correo, rol }));
}

export function cerrarSesionStorage() {
  sessionStorage.removeItem(claveSesion);
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

// 4. Inventario de Productos
export function obtenerProductos(productosIniciales = []) {
  const guardados = localStorage.getItem("productos_los_maestros");
  return guardados ? JSON.parse(guardados) : productosIniciales;
}

export function guardarProductos(productos) {
  localStorage.setItem(
    "productos_los_maestros",
    JSON.stringify(productos)
  );
}