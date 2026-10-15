// src/utils/carrito.js
export function calcularTotal(carrito) {
    if (!Array.isArray(carrito)) return 0;
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}