import { createContext, useContext, useEffect, useState } from "react";
import { renovarSesion } from "../services/authService";
import { cerrarSesionStorage, guardarSesion, obtenerSesionGuardada, vencimientoToken } from "../utils/persistencia";

const SesionContext = createContext(null);

export const etiquetasRol = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente",
};

export function useSesion() {
  return useContext(SesionContext);
}

function adaptarSesion(respuesta) {
  const { token, id, nombre, apellido, correo, rol } = respuesta ?? {};
  if (!Object.hasOwn(etiquetasRol, rol) || !correo || vencimientoToken(token) <= Date.now()) {
    throw new Error("El servicio devolvió una sesión inválida.");
  }
  return { token, usuario: { id, nombre, apellido, correo, rol } };
}

export default function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(obtenerSesionGuardada);
  const token = sesion?.token;

  function activarSesion(respuesta) {
    const nueva = adaptarSesion(respuesta);
    guardarSesion(nueva);
    setSesion(nueva);
    return nueva.usuario;
  }

  function cerrarSesion() {
    cerrarSesionStorage();
    setSesion(null);
  }

  function actualizarNombre(nombre) {
    const vigente = obtenerSesionGuardada();
    if (!vigente) return;
    const actualizada = { ...vigente, usuario: { ...vigente.usuario, nombre, apellido: "" } };
    guardarSesion(actualizada);
    setSesion(actualizada);
  }

  useEffect(() => {
    if (!token) {
      cerrarSesionStorage();
      return;
    }

    const restante = Math.max(0, vencimientoToken(token) - Date.now());
    const controlador = new AbortController();
    const sigueActiva = () => !controlador.signal.aborted && obtenerSesionGuardada()?.token === token;
    const caducidad = setTimeout(() => {
      if (!controlador.signal.aborted && !obtenerSesionGuardada()) cerrarSesion();
    }, restante);

    const renovacion = setTimeout(async () => {
      if (!sigueActiva()) return;
      try {
        const respuesta = await renovarSesion(controlador.signal);
        if (sigueActiva()) activarSesion(respuesta);
      } catch (error) {
        if (sigueActiva() && [400, 401, 403, 404].includes(error.status)) cerrarSesion();
      }
    }, restante - Math.min(60_000, Math.floor(restante / 2)));

    return () => {
      controlador.abort();
      clearTimeout(caducidad);
      clearTimeout(renovacion);
    };
  }, [token]);

  return (
    <SesionContext.Provider value={{ usuario: sesion?.usuario ?? null, activarSesion, cerrarSesion, actualizarNombre }}>
      {children}
    </SesionContext.Provider>
  );
}
