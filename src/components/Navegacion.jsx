import { Link } from "react-router-dom";
import {
  Container,
  Nav,
  Navbar,
  Badge,
  Button
} from "react-bootstrap";

function Navegacion({ cantidadCarrito }) {
  return (
    <Navbar
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className="border-bottom border-secondary"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-white"
        >
          🔨 Los Maestros
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="menu-principal"
          aria-label="Abrir menú"
        />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className="text-warning fw-semibold"
            >
              Inicio
            </Nav.Link>

            <Nav.Link as={Link} to="/productos">
              Productos
            </Nav.Link>

         

            {/* Rutas en minúsculas para coincidir exactamente con App.jsx */}
            <Nav.Link as={Link} to="/nosotros">
              Nosotros
            </Nav.Link>

            <Nav.Link as={Link} to="/blogs">
              Blogs
            </Nav.Link>

            <Nav.Link as={Link} to="/contacto">
              Contacto
            </Nav.Link>

               {/* Acceso requerido por la Guía 11 */}
            <Nav.Link as={Link} to="/admin/productos">
              Administración
            </Nav.Link>

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
              <a
                href="#login"
                className="text-light text-decoration-none"
              >
                Iniciar sesión
              </a>

              <span className="mx-2 text-secondary">|</span>

              <a
                href="#registro"
                className="text-light text-decoration-none"
              >
                Registrar
              </a>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;