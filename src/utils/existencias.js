export function textoExistencias(estado, ficha) {
  if (estado === "carga") return "Consultando existencias…";
  if (estado === "error") return "Disponibilidad no consultable";
  if (!ficha) return "Inventario pendiente";
  return ficha.stockActual === 0 ? "Sin stock" : ficha.stockActual + " unidades";
}

export function stockCritico(ficha) {
  return Boolean(ficha) && ficha.stockActual <= ficha.stockMinimo;
}
