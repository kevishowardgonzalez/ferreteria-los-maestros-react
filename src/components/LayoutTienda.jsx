// src/components/LayoutTienda.jsx
import { Outlet } from "react-router-dom";
import Cabecera from "./Cabecera";
import Navegacion from "./Navegacion";
import PiePagina from "./PiePagina";

function LayoutTienda({ cantidadCarrito }) {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Cabecera />
      <Navegacion cantidadCarrito={cantidadCarrito} />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <PiePagina />
    </div>
  );
}

export default LayoutTienda;