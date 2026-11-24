import { encabezadosAutorizados } from "./encabezadosAutorizados";

async function solicitarAuth(ruta, opciones) {
  const url = import.meta.env.VITE_AUTH_API_URL?.replace(/\/+$/, "");
  if (!url) throw new Error("Falta configurar VITE_AUTH_API_URL.");

  let respuesta;
  try {
    respuesta = await fetch(`${url}/v1/auth/${ruta}`, { method: "POST", ...opciones });
  } catch {
    throw new Error("No se pudo conectar con el servicio de autenticación.");
  }

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const error = new Error(datos?.mensaje || `La solicitud de autenticación falló (HTTP ${respuesta.status}).`);
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}

export async function iniciarSesion(credenciales) {
  return solicitarAuth("login", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credenciales),
  });
}

export async function registrarCliente(datos) {
  return solicitarAuth("register", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export async function renovarSesion(signal) {
  return solicitarAuth("refresh", { headers: encabezadosAutorizados(), signal });
}
