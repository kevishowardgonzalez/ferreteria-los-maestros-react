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
export function obtenerSesion() {
  return obtenerSesionGuardada()?.usuario ?? null;
}

export function vencimientoToken(token) {
  try {
    const partes = token.split(".");
    if (partes.length !== 3 || partes.some((parte) => !parte)) return 0;
    const contenido = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(contenido));
    return Number.isFinite(exp) ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function obtenerSesionGuardada() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem("usuario_sesion"));
    return sesion?.usuario && vencimientoToken(sesion.token) > Date.now() ? sesion : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  sessionStorage.setItem("usuario_sesion", JSON.stringify(sesion));
  localStorage.removeItem("usuario_sesion");
}

export function cerrarSesionStorage() {
  sessionStorage.removeItem("usuario_sesion");
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
