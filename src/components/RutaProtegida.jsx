import { Navigate, Outlet } from "react-router-dom";
import { useSesion } from "./SesionProvider";

export default function RutaProtegida({ rol }) {
  const { usuario, restaurando } = useSesion();

  if (restaurando) return <p role="status">Restaurando sesión</p>;

  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== rol) return <Navigate to="/" replace />;

  return <Outlet />;
}
