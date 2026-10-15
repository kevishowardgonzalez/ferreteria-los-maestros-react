// src/pages/Blogs.jsx
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Blogs() {
  return (
    <main className="container py-4">
      <h1 className="h2 mb-4 fw-bold">Guías Técnicas y Noticias</h1>

      <Row className="g-4">
        {/* Noticia 1 */}
        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm border-0 p-3">
            <Badge bg="warning" text="dark" className="w-auto align-self-start mb-2">
              Guía #1
            </Badge>
            <h2 className="h5 fw-bold">
              Cómo elegir el cemento según el clima de La Serena
            </h2>
            <p className="text-muted small flex-grow-1">
              Factores clave sobre la salinidad costera, fraguado y cómo proteger tus obras de la humedad marina.
            </p>
            <Button as={Link} to="/blogs/1" variant="outline-dark" size="sm" className="mt-2 align-self-start">
              Leer guía completa →
            </Button>
          </Card>
        </Col>

        {/* Noticia 2 */}
        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm border-0 p-3">
            <Badge bg="warning" text="dark" className="w-auto align-self-start mb-2">
              Consejo #2
            </Badge>
            <h2 className="h5 fw-bold">
              Mantenimiento de herramientas eléctricas
            </h2>
            <p className="text-muted small flex-grow-1">
              Revisión periódica de escobillas, limpieza de polvo en percutores y cuidado de baterías de litio.
            </p>
            <Button as={Link} to="/blogs/2" variant="outline-dark" size="sm" className="mt-2 align-self-start">
              Leer consejo completo →
            </Button>
          </Card>
        </Col>
      </Row>
    </main>
  );
}

export default Blogs;