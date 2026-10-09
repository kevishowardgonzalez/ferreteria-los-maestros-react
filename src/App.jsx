import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import Bienvenida from "./components/Bienvenida";
import TarjetaProducto from "./components/TarjetaProducto";
import PiePagina from "./components/PiePagina";

import Catalogo from "./pages/Catalogo";
import { productos } from "./data/productos";

function App() {
  // Estado para filtrar los productos por categoría
  const [categoria, setCategoria] = useState("Todas");

  // Estado del carrito con datos guardados en localStorage
  const [carrito, setCarrito] = useState(() => {
    const guardados = localStorage.getItem("carrito_los_maestros");
    return guardados ? JSON.parse(guardados) : [];
  });

  // Guarda el carrito cada vez que cambia
  useEffect(() => {
    localStorage.setItem(
      "carrito_los_maestros",
      JSON.stringify(carrito)
    );
  }, [carrito]);

  // Filtra los productos según la categoría seleccionada
  const visibles =
    categoria === "Todas"
      ? productos
      : productos.filter(
          (prod) => prod.categoria === categoria
        );

  // Función para agregar productos al carrito
  function agregarAlCarrito(producto) {
    const yaExiste = carrito.some(
      (item) => item.id === producto.id
    );

    if (yaExiste) {
      alert(`"${producto.nombre}" ya está en el carrito.`);
      return;
    }

    setCarrito([...carrito, producto]);
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">

      {/* Encabezado de la ferretería */}
      <Cabecera />

      {/* Barra de navegación */}
      <Navegacion />

      <main className="container flex-grow-1 py-4">

        <Routes>

          {/* RUTA 1: PÁGINA DE INICIO */}
          <Route
            path="/"
            element={
              <>
                <Bienvenida />

                <section className="my-5">

                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-2">

                    <div>
                      <h2 className="h3 fw-bold mb-1">
                        Catálogo de Productos
                      </h2>

                      <p className="text-muted mb-0">
                        Materiales y herramientas con entrega
                        inmediata en La Serena.
                      </p>
                    </div>

                    {/* Filtro de categorías */}
                    <div style={{ minWidth: "220px" }}>
                      <Form.Select
                        value={categoria}
                        onChange={(e) =>
                          setCategoria(e.target.value)
                        }
                        aria-label="Filtrar por categoría"
                      >
                        <option value="Todas">
                          Todas las categorías
                        </option>
                        <option value="Herramientas Eléctricas">
                          Herramientas Eléctricas
                        </option>
                        <option value="Construcción">
                          Construcción
                        </option>
                        <option value="Herramientas Manuales">
                          Herramientas Manuales
                        </option>
                        <option value="Gasfitería">
                          Gasfitería
                        </option>
                        <option value="Pinturas">
                          Pinturas
                        </option>
                        <option value="Electricidad">
                          Electricidad
                        </option>
                      </Form.Select>
                    </div>

                  </div>

                  {/* Lista de productos filtrados */}
                  <Row className="g-4">
                    {visibles.map((prod) => (
                      <Col
                        xs={12}
                        sm={6}
                        lg={3}
                        key={prod.id}
                      >
                        <TarjetaProducto
                          producto={prod}
                          onAgregar={agregarAlCarrito}
                        />
                      </Col>
                    ))}
                  </Row>

                </section>
              </>
            }
          />

          {/* RUTA 2: CATÁLOGO DE PRODUCTOS */}
          <Route
            path="/productos"
            element={
              <>
                <h2 className="h3 fw-bold mb-4">
                  Todos nuestros productos
                </h2>

                <Catalogo
                  productos={productos}
                  onAgregar={agregarAlCarrito}
                />
              </>
            }
          />

        </Routes>

      </main>

      {/* Pie de página */}
      <PiePagina />

    </div>
  );
}

export default App;
