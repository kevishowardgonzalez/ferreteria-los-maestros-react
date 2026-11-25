import { createContext, useContext, useEffect, useRef, useState } from "react";
import { renovarSesion, revocarSesion } from "../services/authService";
import { cerrarSesionStorage, guardarSesion, leerSesionGuardada, obtenerSesionGuardada, vencimientoToken } from "../utils/persistencia";

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
  const { token, refreshToken, id, nombre, apellido, correo, rol } = respuesta ?? {};
  if (!Object.hasOwn(etiquetasRol, rol) || !correo || vencimientoToken(token) <= Date.now()) {
    throw new Error("El servicio devolvió una sesión inválida.");
  }
  return { token, refreshToken, usuario: { id, nombre, apellido, correo, rol } };
}

export default function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const guardada = leerSesionGuardada();
    return guardada?.refreshToken ? guardada : obtenerSesionGuardada();
  });
  const vigente = sesion && vencimientoToken(sesion.token) > Date.now();
  const token = sesion?.token;
  const [avisoLogout, setAvisoLogout] = useState("");
  const operacionLogout = useRef(0);

  function activarSesion(respuesta) {
    const nueva = adaptarSesion(respuesta);
    operacionLogout.current += 1;
    setAvisoLogout("");
    guardarSesion(nueva);
    setSesion(nueva);
    return nueva.usuario;
  }

  function limpiarSesion() {
    cerrarSesionStorage();
    setSesion(null);
  }

  async function cerrarSesion() {
    const refreshToken = leerSesionGuardada()?.refreshToken;
    const operacion = ++operacionLogout.current;
    limpiarSesion();
    if (!refreshToken) {
      setAvisoLogout("");
      return;
    }

    setAvisoLogout("Sesión local cerrada. Confirmando la revocación en el servidor…");
    try {
      await revocarSesion(refreshToken);
      if (operacion === operacionLogout.current) setAvisoLogout("");
    } catch {
      if (operacion === operacionLogout.current) {
        setAvisoLogout("Sesión local cerrada. No se pudo confirmar la revocación en el servidor.");
      }
    }
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

    const refreshToken = sesion.refreshToken;
    const restante = Math.max(0, vencimientoToken(token) - Date.now());
    const controlador = new AbortController();
    const sigueActiva = () => {
      const actual = leerSesionGuardada();
      return !controlador.signal.aborted && actual?.token === token &&
        actual?.refreshToken === refreshToken;
    };
    const caducidad = restante > 0 || !refreshToken
      ? setTimeout(() => {
          if (sigueActiva()) limpiarSesion();
        }, restante)
      : null;
    const renovacion = refreshToken ? setTimeout(async () => {
      if (!sigueActiva()) return;
      try {
        const respuesta = await renovarSesion(refreshToken, controlador.signal);
        if (sigueActiva()) activarSesion(respuesta);
      } catch (error) {
        if (sigueActiva() && (restante === 0 || [400, 401, 403].includes(error.status))) {
          limpiarSesion();
        }
      }
    }, restante - Math.min(60_000, Math.floor(restante / 2))) : null;

    return () => {
      controlador.abort();
      clearTimeout(caducidad);
      clearTimeout(renovacion);
    };
  }, [token, sesion?.refreshToken]);

  return (
    <SesionContext.Provider value={{ usuario: vigente ? sesion.usuario : null, restaurando: Boolean(sesion?.refreshToken && !vigente), activarSesion, cerrarSesion, actualizarNombre }}>
      {avisoLogout && <p className="alert alert-warning mb-0" role="status">{avisoLogout}</p>}
      {children}
    </SesionContext.Provider>
  );
}
