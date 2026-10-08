import TarjetaProducto from "../components/TarjetaProducto";
import { Row, Col } from "react-bootstrap";

function Catalogo({ productos, onAgregar }) {
    return (
        <Row className="g-4">
            {productos.map((producto) => (
                <Col xs={12} sm={6} lg={3} key={producto.id}>
                    <TarjetaProducto producto={producto} onAgregar={onAgregar} />
                </Col>
            ))}
        </Row>
    );
}

export default Catalogo;