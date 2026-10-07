import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import Bienvenida from "./components/Bienvenida";
import TarjetaProducto from "./components/TarjetaProducto";
import PiePagina from "./components/PiePagina";
import { Container, Row, Col } from "react-bootstrap";

function App() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Cabecera y Navegación */}
      <Cabecera />
      <Navegacion />

      {/* Contenido Principal */}
      <main className="container flex-grow-1">
        {/* Banner de Presentación */}
        <Bienvenida />

        {/* Sección de Catálogo Destacado */}
        <section className="my-5">
          <div className="mb-4 border-bottom pb-2">
            <h2 className="h3 fw-bold mb-1">Productos Destacados</h2>
            <p className="text-muted mb-0">
              Materiales y herramientas con entrega inmediata en La Serena.
            </p>
          </div>

          <Row className="g-4">
            <Col xs={12} sm={6} lg={3}>
              <TarjetaProducto 
                nombre="Taladro Percutor 20V" 
                precio="$59.990" 
                descripcion="Mandril de 13 mm. Incluye 2 baterías de litio y maletín." 
                categoria="Herramientas Eléctricas" 
              />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <TarjetaProducto 
                nombre="Cemento Especial 25 kg" 
                precio="$4.890" 
                descripcion="Alta resistencia inicial para radieres, pegado de bloques y estucos." 
                categoria="Construcción" 
              />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <TarjetaProducto 
                nombre="Set Herramientas 45 Pzas" 
                precio="$24.990" 
                descripcion="Alicates, dados milimétricos y destornilladores en maletín reforzado." 
                categoria="Herramientas Manuales" 
              />
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <TarjetaProducto 
                nombre="Tubo PVC Sanitario 110mm" 
                precio="$8.490" 
                descripcion="Tira de 3 metros para desagüe y canalización de aguas servidas." 
                categoria="Gasfitería" 
              />
            </Col>
          </Row>
        </section>
      </main>

      {/* Pie de página institucional */}
      <PiePagina />
    </div>
  );
}

export default App;