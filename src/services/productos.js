import { URLS_API } from "../config/api";
import { clienteHttp } from "./clienteHttp";

const ruta = "/api/productos";

export function listarProductos(token, filtro = "") {
  const consulta = filtro.trim() ? `?${new URLSearchParams({ filtro: filtro.trim() })}` : "";
  return clienteHttp.get(URLS_API.productos, ruta + consulta, { token });
}

export function buscarProducto(id, token) {
  return clienteHttp.get(URLS_API.productos, `${ruta}/${encodeURIComponent(id)}`, { token });
}

export function crearProducto(datos, token) {
  return clienteHttp.post(URLS_API.productos, ruta, datos, { token });
}

export function actualizarProducto(id, datos, token) {
  return clienteHttp.put(URLS_API.productos, `${ruta}/${encodeURIComponent(id)}`, datos, { token });
}

export function eliminarProducto(id, token) {
  return clienteHttp.delete(URLS_API.productos, `${ruta}/${encodeURIComponent(id)}`, { token });
}
