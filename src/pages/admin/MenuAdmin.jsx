// src/pages/admin/MenuAdmin.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";

function MenuAdmin() {
  const navigate = useNavigate();
  const sesionGuardada = localStorage.getItem("usuario_sesion");
  const usuario = sesionGuardada ? JSON.parse(sesionGuardada) : null;
  const esVendedor = usuario?.rol === "Vendedor";

  function cerrarSesion() {
    localStorage.removeItem("usuario_sesion");
    navigate("/login");
  }

  return (
    <aside
      className="bg-white border-end p-3 d-flex flex-column"
      style={{ width: "230px", minWidth: "230px", minHeight: "100vh" }}
    >
      <div className="border-bottom pb-3 mb-3">
        <h2 className="h5 fw-bold text-dark mb-0">🔨 Los Maestros</h2>
        <span className="badge bg-primary mt-1">
          {esVendedor ? "Rol: Vendedor" : "Rol: Administrador"}
        </span>
      </div>

      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column gap-1">
          {!esVendedor && (
            <li className="nav-item">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                    isActive ? "active bg-primary text-white" : "text-secondary"
                  }`
                }
              >
                <span>🏠</span> Dashboard
              </NavLink>
            </li>
          )}

          <li className="nav-item">
            <NavLink
              to="/admin/productos"
              className={({ isActive }) =>
                `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                  isActive ? "active bg-primary text-white" : "text-secondary"
                }`
              }
            >
              <span>🛒</span> Productos
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/admin/ordenes"
              className={({ isActive }) =>
                `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                  isActive ? "active bg-primary text-white" : "text-secondary"
                }`
              }
            >
              <span>📄</span> Órdenes
            </NavLink>
          </li>

          {!esVendedor && (
            <>
              <li className="nav-item">
                <NavLink
                  to="/admin/categorias"
                  className={({ isActive }) =>
                    `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                      isActive ? "active bg-primary text-white" : "text-secondary"
                    }`
                  }
                >
                  <span>📑</span> Categorías
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/usuarios"
                  className={({ isActive }) =>
                    `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                      isActive ? "active bg-primary text-white" : "text-secondary"
                    }`
                  }
                >
                  <span>👥</span> Usuarios
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/reportes"
                  className={({ isActive }) =>
                    `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                      isActive ? "active bg-primary text-white" : "text-secondary"
                    }`
                  }
                >
                  <span>📈</span> Reportes
                </NavLink>
              </li>
            </>
          )}

          <li className="nav-item border-top mt-2 pt-2">
            <NavLink
              to="/admin/perfil"
              className={({ isActive }) =>
                `nav-link rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${
                  isActive ? "active bg-primary text-white" : "text-secondary"
                }`
              }
            >
              <span>👤</span> Perfil
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="d-flex flex-column gap-2 pt-3 border-top mt-auto">
        <Link
          to="/"
          className="btn btn-dark w-100 rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2"
        >
          <span>🏛️</span> Tienda
        </Link>
        <button
          type="button"
          onClick={cerrarSesion}
          className="btn btn-danger w-100 rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2"
        >
          <span>🚪</span> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

export default MenuAdmin;