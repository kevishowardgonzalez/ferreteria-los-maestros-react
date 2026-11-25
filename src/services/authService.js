import { URLS_API } from "../config/api";
import { clienteHttp } from "./clienteHttp";

const base = URLS_API.auth;
const ruta = base.endsWith("/api") ? "/v1/auth" : "/api/v1/auth";

export function iniciarSesion({ correo, password }) {
  return clienteHttp.post(base, ruta + "/login", { correo, password });
}

export function registrarCliente({ run, nombre, apellido, correo, password }) {
  return clienteHttp.post(base, ruta + "/register", { run, nombre, apellido, correo, password });
}

export function renovarSesion(token) {
  return clienteHttp.post(base, ruta + "/refresh", { token });
}
