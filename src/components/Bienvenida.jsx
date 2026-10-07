import { Container, Button } from "react-bootstrap";

function Bienvenida() {
  return (
    <section className="bg-dark text-white py-5 rounded-4 my-4 shadow-sm p-4 p-md-5 border border-secondary" style={{ backgroundColor: "#1e293b" }}>
      <Container>
        <p className="text-warning text-uppercase fw-bold mb-2 small">
          Materiales & Herramientas en La Serena
        </p>
        <h2 className="display-6 fw-bold mb-3">
          Construye con la confianza de los verdaderos maestros
        </h2>
        <p className="lead text-light mb-4" style={{ maxWidth: "700px" }}>
          Más de 22 años equipando a maestros de obra, contratistas y familias de la Región de Coquimbo con stock garantizado.
        </p>
        <Button variant="warning" size="md" className="fw-bold px-4 text-dark">
          Ver catálogo de productos
        </Button>
      </Container>
    </section>
  );
}

export default Bienvenida;