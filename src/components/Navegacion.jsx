
import { Container, Nav, Navbar, Badge, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function Navegacion() {
  return (
    <Navbar
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      className="border-bottom border-secondary"
    >
      <Container>
        {/* Nombre de la ferretería */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-white"
        >
          Los Maestros
        </Navbar.Brand>

        {/* Botón para mostrar el menú en dispositivos móviles */}
        <Navbar.Toggle
          aria-controls="menu-principal"
          aria-label="Abrir menú"
        />

        <Navbar.Collapse id="menu-principal">
          {/* Enlaces de navegación */}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>

            <Nav.Link as={NavLink} to="/productos">
              Productos
            </Nav.Link>

            {/* Enlaces pendientes de implementar */}
            <Nav.Link href="#nosotros">Nosotros</Nav.Link>
            <Nav.Link href="#blogs">Blogs</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
          </Nav>

          {/* Carrito y opciones de usuario */}
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-light" size="sm">
              🛒 Carrito <Badge bg="warning" text="dark">0</Badge>
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
