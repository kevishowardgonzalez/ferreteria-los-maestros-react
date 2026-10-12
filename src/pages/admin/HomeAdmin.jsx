// src/pages/admin/HomeAdmin.jsx
import { Link } from "react-router-dom";
import MenuAdmin from "./MenuAdmin";

function HomeAdmin() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Barra negra superior de la plantilla */}
      <header className="bg-dark text-white px-3 py-2 d-flex align-items-center border-bottom">
        <span className="fw-semibold small">Configuracion Perfil Administrador</span>
      </header>

      <div className="d-flex flex-grow-1">
        {/* Menú lateral */}
        <MenuAdmin />

        {/* Contenido del Dashboard */}
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <div className="mb-4">
            <h1 className="h4 fw-bold mb-1 text-dark">Dashboard</h1>
            <p className="text-secondary small mb-0">Resumen de las actividades diarias</p>
          </div>

          {/* 3 Tarjetas Grandes de Colores */}
          <div className="row g-3 mb-4">
            {/* Azul: Compras */}
            <div className="col-12 col-md-4">
              <div
                className="card border-0 text-white p-3 rounded-3 shadow-sm h-100"
                style={{ backgroundColor: "#0d6efd" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="small opacity-75">Compras</span>
                    <h2 className="display-6 fw-bold mb-0">1,234</h2>
                  </div>
                  <span style={{ fontSize: "2.8rem" }}>🛒</span>
                </div>
                <div className="mt-3 pt-2 border-top border-white border-opacity-25 text-center small opacity-75">
                  Probabilidad de aumento: <strong>20%</strong>
                </div>
              </div>
            </div>

            {/* Verde: Productos */}
            <div className="col-12 col-md-4">
              <div
                className="card border-0 text-white p-3 rounded-3 shadow-sm h-100"
                style={{ backgroundColor: "#198754" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="small opacity-75">Productos</span>
                    <h2 className="display-6 fw-bold mb-0">400</h2>
                  </div>
                  <span style={{ fontSize: "2.8rem" }}>📦</span>
                </div>
                <div className="mt-3 pt-2 border-top border-white border-opacity-25 text-center small opacity-75">
                  Inventario actual: <strong>500</strong>
                </div>
              </div>
            </div>

            {/* Amarilla: Usuarios */}
            <div className="col-12 col-md-4">
              <div
                className="card border-0 text-white p-3 rounded-3 shadow-sm h-100"
                style={{ backgroundColor: "#ffc107" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="small opacity-75 text-dark">Usuarios</span>
                    <h2 className="display-6 fw-bold mb-0 text-dark">890</h2>
                  </div>
                  <span style={{ fontSize: "2.8rem" }}>👥</span>
                </div>
                <div className="mt-3 pt-2 border-top border-dark border-opacity-25 text-center small text-dark opacity-75">
                  Nuevos usuarios este mes: <strong>120</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 8 Tarjetas Blancas de Accesos Rápidos */}
          <div className="row g-3">
            {/* 1. Dashboard (Ahora con Link a /admin) */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/admin" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>⏲️</div>
                  <h3 className="h6 fw-bold mb-1">Dashboard</h3>
                  <p className="text-muted small mb-0">
                    Visión general de todas las métricas y estadísticas clave del sistema.
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. Órdenes */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/admin/ordenes" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>🛒</div>
                  <h3 className="h6 fw-bold mb-1">Órdenes</h3>
                  <p className="text-muted small mb-0">
                    Gestión y seguimiento de todas las órdenes de compra realizadas.
                  </p>
                </div>
              </Link>
            </div>

            {/* 3. Productos */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/admin/productos" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>📦</div>
                  <h3 className="h6 fw-bold mb-1">Productos</h3>
                  <p className="text-muted small mb-0">
                    Administrar inventario y detalles de los productos disponibles.
                  </p>
                </div>
              </Link>
            </div>

            {/* 4. Categorías */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/admin/categorias" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>🏷️</div>
                  <h3 className="h6 fw-bold mb-1">Categorías</h3>
                  <p className="text-muted small mb-0">
                    Organizar productos en categorías para facilitar su navegación.
                  </p>
                </div>
              </Link>
            </div>

            {/* 5. Usuarios */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/admin/usuarios" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>👥</div>
                  <h3 className="h6 fw-bold mb-1">Usuarios</h3>
                  <p className="text-muted small mb-0">
                    Gestión de cuentas de usuario y sus roles dentro del sistema.
                  </p>
                </div>
              </Link>
            </div>

            {/* 6. Reportes */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/admin/reportes" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>📊</div>
                  <h3 className="h6 fw-bold mb-1">Reportes</h3>
                  <p className="text-muted small mb-0">
                    Generación de informes detallados sobre las operaciones del sistema.
                  </p>
                </div>
              </Link>
            </div>

            {/* 7. Perfil */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/admin/perfil" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>👤</div>
                  <h3 className="h6 fw-bold mb-1">Perfil</h3>
                  <p className="text-muted small mb-0">
                    Administración de la información personal y configuraciones de cuenta.
                  </p>
                </div>
              </Link>
            </div>

            {/* 8. Tienda */}
            <div className="col-12 col-sm-6 col-lg-3">
              <Link to="/" className="text-decoration-none text-dark">
                <div className="card bg-white border-0 shadow-sm p-4 text-center rounded-3 h-100">
                  <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>🏬</div>
                  <h3 className="h6 fw-bold mb-1">Tienda</h3>
                  <p className="text-muted small mb-0">
                    Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomeAdmin;