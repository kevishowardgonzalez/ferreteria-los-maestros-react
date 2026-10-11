
export function guardarCarrito(datos) {
  localStorage.setItem("carrito_los_maestros", JSON.stringify(datos));
}