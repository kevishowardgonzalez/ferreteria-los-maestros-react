// src/components/Navegacion.jsx
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Badge, Button } from "react-bootstrap";

function Navegacion({ cantidadCarrito = 0 }) {
  const navigate = useNavigate();

  const sesionGuardada = localStorage.getItem("usuario_sesion");
  const usuario = sesionGuardada ? JSON.parse(sesionGuardada) : null;

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
    localStorage.removeItem("usuario_sesion");
    navigate("/");
    window.location.reload();
  }

  return (
    <Navbar
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className="border-bottom border-secondary"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white me-4">
          🔨 Los Maestros
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/" className="text-warning fw-semibold">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/productos">
              Productos
            </Nav.Link>
            <Nav.Link as={Link} to="/nosotros">
              Nosotros
            </Nav.Link>
            <Nav.Link as={Link} to="/blogs">
              Blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto">
              Contacto
            </Nav.Link>

            {/* VENDEDOR -> apunta directo a /vendedor/productos */}
            {esVendedor && (
              <Nav.Link
                as={Link}
                to="/vendedor/productos"
                className="text-info fw-bold text-nowrap ms-2"
              >
                💼 Vendedor
              </Nav.Link>
            )}

            {/* ADMINISTRADOR -> apunta a /admin */}
            {esAdmin && (
              <Nav.Link
                as={Link}
                to="/admin"
                className="text-warning fw-bold text-nowrap ms-2"
              >
                🛠️ Administración
              </Nav.Link>
            )}

            {/* CLIENTE -> apunta a /cliente/compras */}
            {esCliente && (
              <Nav.Link
                as={Link}
                to="/cliente/compras"
                className="text-success fw-bold text-nowrap ms-2"
              >
                📦 Mis Compras
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3">
            <Button
              as={Link}
              to="/carrito"
              variant="outline-light"
              size="sm"
            >
              🛒 Carrito{" "}
              <Badge bg="warning" text="dark">
                {cantidadCarrito}
              </Badge>
            </Button>

            <div className="text-light small text-nowrap">
              {usuario ? (
                <span>
                  Hola, <strong>{usuario.nombre || usuario.correo}</strong>{" "}
                  <button
                    onClick={cerrarSesion}
                    className="btn btn-link text-warning text-decoration-none btn-sm p-0 ms-1"
                  >
                    (Salir)
                  </button>
                </span>
              ) : (
                <>
                  <Link to="/login" className="text-light text-decoration-none">
                    Iniciar sesión
                  </Link>
                  <span className="mx-2 text-secondary">|</span>
                  <Link to="/registro" className="text-light text-decoration-none">
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;