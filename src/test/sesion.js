import { guardarSesion } from "../utils/persistencia";

export function respuestaSesion(rol = "CLIENTE", campos = {}, exp = Math.floor(Date.now() / 1000) + 3600) {
  return {
    id: 1, nombre: "Persona", apellido: "Prueba", correo: "persona@example.test", rol,
    token: [btoa(JSON.stringify({ alg: "HS256" })), btoa(JSON.stringify({ exp })), "prueba"].join("."),
    ...campos,
  };
}

export function prepararSesion(rol, campos) {
  const respuesta = respuestaSesion(rol, campos);
  guardarSesion(respuesta);
  return respuesta;
}
