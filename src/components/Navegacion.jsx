import { Container, Nav, Navbar, Badge, Button } from "react-bootstrap";

function Navegacion() {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="border-bottom border-secondary">
      <Container>
        <Navbar.Brand href="#inicio" className="fw-bold text-white">

        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link href="#inicio" className="text-warning fw-semibold">Inicio</Nav.Link>
            <Nav.Link href="#productos">Productos</Nav.Link>
            <Nav.Link href="#nosotros">Nosotros</Nav.Link>
            <Nav.Link href="#blogs">Blogs</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-3">
            <Button variant="outline-light" size="sm">
              🛒 Carrito <Badge bg="warning" text="dark">0</Badge>
            </Button>
            <div className="text-light small">
              <a href="#login" className="text-light text-decoration-none">Iniciar sesión</a>
              <span className="mx-2 text-secondary">|</span>
              <a href="#registro" className="text-light text-decoration-none">Registrar</a>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;