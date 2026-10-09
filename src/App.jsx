import { useState, useEffect } from "react";
import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import Bienvenida from "./components/Bienvenida";
import TarjetaProducto from "./components/TarjetaProducto";
import PiePagina from "./components/PiePagina";
import { productos } from "./data/productos";
import { Container, Row, Col, Form } from "react-bootstrap";

function App() {
  const [categoria, setCategoria] = useState("Todas");

  const [carrito, setCarrito] = useState(() => {
    const guardados = localStorage.getItem("carrito_los_maestros");
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito_los_maestros", JSON.stringify(carrito));
  }, [carrito]);

  const visibles = categoria === "Todas"
    ? productos
    : productos.filter((prod) => prod.categoria === categoria);

  function agregarAlCarrito(producto) {
    const yaExiste = carrito.some((item) => item.id === producto.id);
    if (yaExiste) {
      alert(`"${producto.nombre}" ya está en el carrito.`);
      return;
    }
    setCarrito([...carrito, producto]);
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Cabecera />
      <Navegacion />

      <main className="container flex-grow-1 py-4">
        <Bienvenida />

        <section className="my-5">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-2">
            <div>
              <h2 className="h3 fw-bold mb-1">Catálogo de Productos</h2>
              <p className="h9 fw-bold mb-1">
                Materiales y herramientas con entrega inmediata en La Serena
              </p>
            </div>

            <div style={{ minWidth: "220px" }}>
              <Form.Select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                <option value="Todas">Todas las categorías</option>
                <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                <option value="Construcción">Construcción</option>
                <option value="Herramientas Manuales">Herramientas Manuales</option>
                <option value="Gasfitería">Gasfitería</option>
                <option value="Pinturas">Pinturas</option>
                <option value="Electricidad">Electricidad</option>
              </Form.Select>
            </div>
          </div>

          <Row className="g-4">
            {visibles.map((prod) => (
              <Col xs={12} sm={6} lg={3} key={prod.id}>
                <TarjetaProducto
                  producto={prod}
                  onAgregar={agregarAlCarrito}
                />
              </Col>
            ))}
          </Row>
        </section>
      </main>

      <PiePagina />
    </div>
  );
}

export default App;