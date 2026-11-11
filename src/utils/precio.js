// src/utils/precio.js
export function formatearPrecio(valor) {
  if (valor === 0 || valor === null || valor === undefined) return "Sin costo";
  return `$${Number(valor).toLocaleString("es-CL")}`;
}

export function calcularDescuento(precio, porcentaje) {
  if (!porcentaje || porcentaje <= 0) return precio;
  return Math.round(precio * (1 - porcentaje / 100));
}