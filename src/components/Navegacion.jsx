// src/components/Navegacion.jsx
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Badge, Button } from "react-bootstrap";

function Navegacion({ cantidadCarrito }) {
  const navigate = useNavigate();

  // Leemos la sesión guardada en localStorage
  const sesionGuardada = localStorage.getItem("usuario_sesion");
  const usuario = sesionGuardada ? JSON.parse(sesionGuardada) : null;

  // Verificamos si es administrador
  const esAdmin =
    usuario &&
    (usuario.rol === "Administrador" || usuario.correo?.includes("admin"));

  function cerrarSesion() {
    localStorage.removeItem("usuario_sesion");
    navigate("/");
    window.location.reload(); // Recarga para limpiar el estado de la barra
  }

  return (
    <Navbar
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className="border-bottom border-secondary"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          🔨 Los Maestros
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
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

            {/* SI ES ADMIN, SE MUESTRA ADMINISTRACIÓN */}
            {esAdmin && (
              <Nav.Link as={Link} to="/admin/productos" className="text-info fw-bold">
                Administración
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

            <div className="text-light small">
              {usuario ? (
                <span>
                  Hola, <strong>{usuario.correo}</strong>{" "}
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