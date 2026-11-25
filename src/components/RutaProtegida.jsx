import { Navigate, Outlet } from "react-router-dom";
import { useSesion } from "../hooks/useSesion";
import { destinosPorRol, sesionVigente } from "../utils/sesion";

export default function RutaProtegida({ rol }) {
  const { usuario } = useSesion();
  if (!sesionVigente(usuario)) return <Navigate to="/login" replace />;
  if (usuario.rol !== rol) return <Navigate to={destinosPorRol[usuario.rol]} replace />;
  return <Outlet />;
}
