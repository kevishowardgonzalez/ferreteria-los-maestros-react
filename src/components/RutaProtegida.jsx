import { Navigate, Outlet } from "react-router-dom";
import { useSesion } from "./SesionProvider";

export default function RutaProtegida({ rol }) {
  const { usuario } = useSesion();

  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== rol) return <Navigate to="/" replace />;

  return <Outlet />;
}
