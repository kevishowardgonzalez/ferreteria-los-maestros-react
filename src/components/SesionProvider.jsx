import { useCallback, useEffect, useState } from "react";
import { cerrarSesionStorage, guardarSesion, obtenerSesion } from "../utils/persistencia";
import { sesionVigente, vencimientoToken } from "../utils/sesion";

import { SesionContext } from "../hooks/useSesion";

export default function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(obtenerSesion);
  const token = sesion?.token;

  const cerrarSesion = useCallback(() => {
    cerrarSesionStorage();
    setSesion(null);
  }, []);

  function activarSesion({ token, id, nombre, apellido, correo, rol } = {}) {
    const usuario = { token, id, nombre, apellido, correo, rol };
    if (!sesionVigente(usuario)) throw new Error("Auth devolvió una sesión inválida.");
    guardarSesion(usuario);
    setSesion(usuario);
    return usuario;
  }

  function actualizarNombre(nombre) {
    if (sesionVigente(sesion)) activarSesion({ ...sesion, nombre });
  }

  const rechazarCredencial = useCallback((error, credencial) => {
    if (error.estado === 401 && credencial === token && obtenerSesion()?.token === credencial) {
      cerrarSesion();
    }
  }, [token, cerrarSesion]);

  useEffect(() => {
    if (!token) {
      if (!obtenerSesion()) cerrarSesionStorage();
      return;
    }
    const vencimiento = setTimeout(cerrarSesion, Math.max(0, vencimientoToken(token) - Date.now()));
    return () => clearTimeout(vencimiento);
  }, [token, cerrarSesion]);

  return (
    <SesionContext.Provider value={{ usuario: sesionVigente(sesion) ? sesion : null, activarSesion, cerrarSesion, actualizarNombre, rechazarCredencial }}>
      {children}
    </SesionContext.Provider>
  );
}
