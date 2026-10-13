// src/components/Navegacion.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Badge, Button } from "react-bootstrap";
import { obtenerSesion, cerrarSesionStorage } from "../utils/persistencia";

// Tono amarillo/ocre oficial de Ferretería Los Maestros
const COLOR_ACENTO = "#F2A93B";

function Navegacion({ cantidadCarrito = 0 }) {
  const navigate = useNavigate();
  const usuario = obtenerSesion();

  const esAdmin =
    usuario &&
    (usuario.rol === "Administrador" || usuario.correo?.includes("admin"));

  const esVendedor =
    usuario &&
    (usuario.rol === "Vendedor" ||
      usuario.correo?.includes("vendedor") ||
      usuario.correo?.includes("javier"));

  const esCliente = usuario && usuario.rol === "Cliente";

  function cerrarSesion() {
    cerrarSesionStorage();
    navigate("/");
    window.location.reload();
  }

  // Estilo activo con el color amarillo exacto de la ferretería
  const estiloNav = ({ isActive }) => ({
    color: isActive ? COLOR_ACENTO : "#ffffff",
    borderBottom: isActive ? `3px solid ${COLOR_ACENTO}` : "3px solid transparent",
    fontWeight: isActive ? "700" : "500",
    textDecoration: "none",
    paddingBottom: "4px",
    transition: "color 0.2s ease, border-color 0.2s ease"
  });

  // Estilo activo para los enlaces de la barra superior (top-bar)
  const estiloTopAuth = ({ isActive }) => ({
    color: isActive ? COLOR_ACENTO : "#e2e8f0",
    borderBottom: isActive ? `2px solid ${COLOR_ACENTO}` : "2px solid transparent",
    fontWeight: isActive ? "700" : "400",
    textDecoration: "none",
    paddingBottom: "2px",
    transition: "color 0.2s ease, border-color 0.2s ease"
  });

  return (
    <header className="sticky-top">
      {/* 1. TOP-BAR SUPERIOR */}
      <div className="bg-black text-light py-1 border-bottom border-dark">
        <Container fluid className="px-3 px-lg-4 d-flex justify-content-between align-items-center">
          <small className="text-secondary d-none d-md-inline">
            📍 Ferretería Los Maestros · La Serena
          </small>

          <div className="small ms-auto d-flex align-items-center gap-2">
            {usuario ? (
              <span>
                Hola, <strong style={{ color: COLOR_ACENTO }}>{usuario.nombre || usuario.correo}</strong>
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="btn btn-link text-danger text-decoration-none btn-sm p-0 ms-2 fw-semibold"
                >
                  (Cerrar sesión)
                </button>
              </span>
            ) : (
              <span className="d-flex align-items-center">
                {/* Ahora con NavLink y estilo activo para indicar dónde estás */}
                <NavLink to="/login" style={estiloTopAuth} className="px-1">
                  Iniciar sesión
                </NavLink>
                <span className="mx-2 text-secondary">|</span>
                <NavLink to="/registro" style={estiloTopAuth} className="px-1">
                  Registrar
                </NavLink>
              </span>
            )}
          </div>
        </Container>
      </div>

      {/* 2. MENÚ PRINCIPAL */}
      <Navbar
        expand="lg"
        bg="dark"
        data-bs-theme="dark"
        className="border-bottom border-secondary py-2 shadow-sm"
      >
        <Container fluid className="px-3 px-lg-4">
          <Navbar.Brand as={Link} to="/" className="fw-bold text-white me-4">
            🔨 Los Maestros
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />

          <Navbar.Collapse id="menu-principal">
            <Nav className="me-auto align-items-center gap-2">
              <Nav.Link as={NavLink} to="/" end style={estiloNav} className="px-2">
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/productos" style={estiloNav} className="px-2">
                Productos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/nosotros" style={estiloNav} className="px-2">
                Nosotros
              </Nav.Link>
              <Nav.Link as={NavLink} to="/blogs" style={estiloNav} className="px-2">
                Blogs
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contacto" style={estiloNav} className="px-2">
                Contacto
              </Nav.Link>

              {/* VENDEDOR */}
              {esVendedor && (
                <Nav.Link as={NavLink} to="/vendedor/productos" style={estiloNav} className="px-2">
                  💼 Vendedor
                </Nav.Link>
              )}

              {/* ADMINISTRADOR */}
              {esAdmin && (
                <Nav.Link as={NavLink} to="/admin" style={estiloNav} className="px-2">
                  🛠️ Administración
                </Nav.Link>
              )}

              {/* CLIENTE */}
              {esCliente && (
                <>
                  <Nav.Link as={NavLink} to="/cliente/compras" style={estiloNav} className="px-2">
                    📦 Mis Compras
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/cliente/perfil" style={estiloNav} className="px-2">
                    👤 Mi Perfil
                  </Nav.Link>
                </>
              )}
            </Nav>

            {/* BOTÓN CARRITO */}
            <div className="d-flex align-items-center">
              <Button
                as={NavLink}
                to="/carrito"
                variant="outline-warning"
                size="sm"
                className="fw-semibold text-nowrap px-3"
                style={({ isActive }) => ({
                  borderColor: COLOR_ACENTO,
                  backgroundColor: isActive ? COLOR_ACENTO : "transparent",
                  color: isActive ? "#000" : COLOR_ACENTO,
                  fontWeight: "bold"
                })}
              >
                🛒 Carrito{" "}
                <Badge bg="warning" text="dark" className="ms-1">
                  {cantidadCarrito}
                </Badge>
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Navegacion;