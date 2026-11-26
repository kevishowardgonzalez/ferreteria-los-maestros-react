
import TarjetaProducto from "../components/TarjetaProducto";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Catalogo({ productos, onAgregar, cargando, error, revision }) {
  if (cargando) return <p role="status">Cargando productos...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!productos.length) return <p>No se encontraron productos.</p>;
  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <Col xs={12} sm={6} lg={3} key={producto.id}>
          <TarjetaProducto
            producto={producto}
            revision={revision}
            onAgregar={onAgregar}
            detalle={<Link to={`/productos/${producto.id}`} className="btn btn-outline-secondary btn-sm mb-2">Ver detalle</Link>}
          />
        </Col>
      ))}
    </Row>
  );
}

export default Catalogo;
