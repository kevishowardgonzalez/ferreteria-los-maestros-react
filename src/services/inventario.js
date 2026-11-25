import { URLS_API } from "../config/api";
import { clienteHttp } from "./clienteHttp";

const base = URLS_API.inventario;
const ruta = "/api/v1/inventario";

export function consultarExistencias(id) {
  return clienteHttp.get(base, ruta + "/producto/" + encodeURIComponent(id));
}

export function listarInventario(token) {
  return clienteHttp.get(base, ruta, { token });
}

export function listarMovimientos(id, token) {
  return clienteHttp.get(base, ruta + "/producto/" + encodeURIComponent(id) + "/movimientos", { token });
}

export function registrarFicha(producto, stockActual, token) {
  return clienteHttp.post(base, ruta, {
    productoId: producto.id, productoSku: "PROD-" + producto.id,
    productoNombre: producto.nombre, stockActual,
  }, { token });
}

export function registrarMovimiento(datos, token) {
  return clienteHttp.post(base, ruta + "/movimientos", datos, { token });
}
