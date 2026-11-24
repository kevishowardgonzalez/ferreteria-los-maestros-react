import { obtenerSesionGuardada } from "../utils/persistencia";

export function encabezadosAutorizados(iniciales) {
  const sesion = obtenerSesionGuardada();
  if (!sesion) throw new Error("Tu sesión ha caducado. Inicia sesión nuevamente.");

  const headers = new Headers(iniciales);
  headers.set("Authorization", `Bearer ${sesion.token}`);
  return headers;
}
