// src/pages/vendedor/MenuVendedor.jsx
import { NavLink, Link } from "react-router-dom";

function MenuVendedor() {
  return (
    <aside
      className="bg-white border-end p-3 d-flex flex-column h-100"
      style={{ width: "230px", minWidth: "230px" }}
    >
      <div className="border-bottom pb-3 mb-3">
        <h2 className="h5 fw-bold text-dark mb-0">🔨 Los Maestros</h2>
        <span className="badge bg-info text-dark mt-1">Panel de Vendedor</span>
      </div>

      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column gap-1">
          <li className="nav-item">
            <NavLink
              to="/vendedor/productos"
              className={({ isActive }) =>
                `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                  isActive ? "active bg-primary text-white" : "text-secondary"
                }`
              }
            >
              <span>🛒</span> Lista de Productos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/vendedor/ordenes"
              className={({ isActive }) =>
                `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                  isActive ? "active bg-primary text-white" : "text-secondary"
                }`
              }
            >
              <span>📄</span> Lista de Órdenes
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="d-flex flex-column gap-2 pt-3 border-top mt-auto">
        <Link to="/" className="btn btn-dark w-100 rounded-2 fw-semibold py-2">
          🏪 Ir a la Tienda
        </Link>
        <Link
          to="/login"
          onClick={() => localStorage.removeItem("usuario_sesion")}
          className="btn btn-danger w-100 rounded-2 fw-semibold py-2"
        >
          🚪 Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
}

export default MenuVendedor;