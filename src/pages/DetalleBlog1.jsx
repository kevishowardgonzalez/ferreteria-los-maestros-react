import { Container, Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function DetalleBlog1() {
  return (
    <main className="container py-4">
      <div className="mb-3">
        <Link to="/blogs" className="text-decoration-none text-secondary">
          ← Volver a Blogs
        </Link>
      </div>

      <Card className="shadow-sm border-0 p-4 p-md-5">
        <Badge bg="warning" text="dark" className="align-self-start mb-3">
          Guía Técnica #1
        </Badge>
        
        <h1 className="h2 fw-bold mb-3">
          Cómo elegir el cemento según el clima de La Serena
        </h1>
        
        <p className="text-muted small border-bottom pb-3 mb-4">
          Publicado por <strong>Equipo Técnico Ferretería Los Maestros</strong> · La Serena, Región de Coquimbo
        </p>

        <div className="text-secondary" style={{ lineHeight: "1.8" }}>
          <p>
            En zonas costeras como La Serena y Coquimbo, la humedad ambiental y la brisa marina (camanchaca) introducen cloruros y sulfatos que aceleran la corrosión de las armaduras de fierro y debilitan el hormigón convencional si no se toman los resguardos adecuados.
          </p>

          <h2 className="h5 fw-bold text-dark mt-4">1. Resistencia a la salinidad y sulfatos</h2>
          <p>
            Para radieres exteriores, cimientos y muros perimetrales, se recomienda utilizar cemento con adición puzolánica especial. Este tipo de cemento disminuye la porosidad del fraguado, reduciendo la filtración de agua salina hacia el interior de la mezcla.
          </p>

          <h2 className="h5 fw-bold text-dark mt-4">2. Curado y control de evaporación</h2>
          <p>
            El viento costero de la tarde tiende a secar la superficie del hormigón más rápido de lo habitual, provocando fisuras por retracción plástica. Es fundamental mantener el curado húmedo mediante riego suave al menos 2 veces al día durante los primeros 7 días.
          </p>

          <h2 className="h5 fw-bold text-dark mt-4">3. Recomendación en obra</h2>
          <p>
            Para faenas residenciales estándar, el <em>Cemento Especial 25 kg</em> disponible en nuestro catálogo ofrece la relación ideal de trabajabilidad y resistencia inicial requerida para el suelo de nuestra zona.
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

export default DetalleBlog1;