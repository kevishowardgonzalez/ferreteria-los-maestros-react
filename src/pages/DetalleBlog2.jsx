// src/pages/DetalleBlog2.jsx
import { Container, Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function DetalleBlog2() {
  return (
    <main className="container py-4">
      <div className="mb-3">
        <Link to="/blogs" className="text-decoration-none text-secondary">
          ← Volver a Blogs
        </Link>
      </div>

      <Card className="shadow-sm border-0 p-4 p-md-5">
        <Badge bg="warning" text="dark" className="align-self-start mb-3">
          Consejo #2
        </Badge>
        
        <h1 className="h2 fw-bold mb-3">
          Mantenimiento de herramientas eléctricas: alarga su vida útil
        </h1>
        
        <p className="text-muted small border-bottom pb-3 mb-4">
          Publicado por <strong>Equipo Técnico Ferretería Los Maestros</strong> · La Serena, Región de Coquimbo
        </p>

        <div className="text-secondary" style={{ lineHeight: "1.8" }}>
          <p>
            El trabajo diario en construcción somete a taladros, esmeriles y sierras circulares a condiciones severas de polvo de corte, aserrín y cambios térmicos. Un mantenimiento preventivo mensual previene averías de motor costosas y detenciones inesperadas en obra.
          </p>

          <h2 className="h5 fw-bold text-dark mt-4">1. Despeje de ranuras de ventilación</h2>
          <p>
            El polvo acumulado tapona las rejillas de refrigeración, provocando recalentamiento del inducido. Aplica aire a presión seco periódicamente para mantener despejadas las tomas de aire tras cada faena de corte o desbaste.
          </p>

          <h2 className="h5 fw-bold text-dark mt-4">2. Revisión de carbones (escobillas)</h2>
          <p>
            Si detectas chispas excesivas visibles a través de la carcasa o pérdida intermitente de fuerza, revisa el largo de las escobillas de carbón. Reemplazarlas antes de que lleguen a su límite evita rayaduras irreversibles en el colector.
          </p>

          <h2 className="h5 fw-bold text-dark mt-4">3. Cuidados con baterías de litio</h2>
          <p>
            Nunca dejes las baterías de tus percutores expuestas al sol directo sobre andamios o dentro de maleteros a altas temperaturas. Almacénalas en lugares secos con al menos un 40% de carga.
          </p>
        </div>

        <div className="mt-4 pt-3 border-top d-flex gap-2">
          <Button as={Link} to="/" variant="warning" className="fw-bold">
            Ir al Inicio
          </Button>
          <Button as={Link} to="/blogs" variant="outline-secondary">
            Ver más guías
          </Button>
        </div>
      </Card>
    </main>
  );
}

export default DetalleBlog2;