
export function formatearPrecio(valor) {
    if (valor === 0) return "Sin costo";
    return `$${valor.toLocaleString("es-CL")}`;
}