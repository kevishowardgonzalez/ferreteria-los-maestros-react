import { URLS_API } from "../config/api";
import { clienteHttp } from "./clienteHttp";

const ruta = "/api/v1/categorias";

export function listarCategorias(token) {
  return clienteHttp.get(URLS_API.categorias, ruta, { token });
}

export function listarCategoriasActivas(token) {
  return clienteHttp.get(URLS_API.categorias, `${ruta}/activas`, { token });
}

export function crearCategoria(datos, token) {
  return clienteHttp.post(URLS_API.categorias, ruta, datos, { token });
}

export function actualizarCategoria(id, datos, token) {
  return clienteHttp.put(URLS_API.categorias, `${ruta}/${encodeURIComponent(id)}`, datos, { token });
}

export function desactivarCategoria(id, token) {
  return clienteHttp.delete(URLS_API.categorias, `${ruta}/${encodeURIComponent(id)}`, { token });
}
