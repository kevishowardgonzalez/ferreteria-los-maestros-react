// src/utils/validaciones.js

// 1. Validar RUT chileno con algoritmo Módulo 11 (requisito de la pauta)
export function validarRut(rutCompleto) {
  if (!rutCompleto || typeof rutCompleto !== "string") return false;
  const limpio = rutCompleto.replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length < 8) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * Number(cuerpo[i]);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado =
    dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : String(dvEsperado);

  return dv === dvCalculado;
}

// 2. Validar dominios de correo autorizados (@duoc.cl, @profesor.duoc.cl, @gmail.com)
export function validarCorreo(correo) {
  if (!correo) return false;
  const dominiosPermitidos = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
  const partes = correo.trim().toLowerCase().split("@");
  if (partes.length !== 2) return false;
  return dominiosPermitidos.includes(partes[1]);
}

// 3. Validar datos de inventario
export function validarStockYPrecio(precio, stock) {
  if (Number(precio) <= 0) return "El precio debe ser mayor a 0";
  if (Number(stock) < 0) return "El stock no puede ser negativo";
  return "";
}