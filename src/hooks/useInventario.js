import { useEffect, useState } from "react";
import { consultarExistencias, listarInventario } from "../services/inventario";
import { useSesion } from "./useSesion";

export function useExistencias(id, revision) {
  const [resultado, setResultado] = useState(null);
  useEffect(() => {
    if (id == null) return;
    let vigente = true;
    consultarExistencias(id)
      .then((ficha) => { if (vigente) setResultado({ id, revision, ficha }); })
      .catch((error) => { if (vigente) setResultado({ id, revision, error }); });
    return () => { vigente = false; };
  }, [id, revision]);
  if (!resultado || resultado.id !== id || resultado.revision !== revision) return { estado: "carga" };
  if (resultado.error) return { estado: resultado.error.estado === 404 ? "disponible" : "error" };
  return { estado: "disponible", ficha: resultado.ficha };
}

export function useInventario(revision) {
  const { usuario, rechazarCredencial } = useSesion();
  const token = ["ADMIN", "VENDEDOR"].includes(usuario?.rol) ? usuario.token : null;
  const [resultado, setResultado] = useState(null);
  useEffect(() => {
    if (!token) return;
    let vigente = true;
    listarInventario(token)
      .then((fichas) => { if (vigente) setResultado({ token, revision, fichas }); })
      .catch((error) => {
        if (!vigente) return;
        rechazarCredencial(error, token);
        setResultado({ token, revision, error });
      });
    return () => { vigente = false; };
  }, [token, revision, rechazarCredencial]);
  if (!token || resultado?.token !== token || resultado?.revision !== revision) {
    return { fichas: null, estado: "carga" };
  }
  return resultado.error ? { fichas: null, estado: "error" } : { fichas: resultado.fichas, estado: "disponible" };
}
