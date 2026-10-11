import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";

import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import Bienvenida from "./components/Bienvenida";
import TarjetaProducto from "./components/TarjetaProducto";
import PiePagina from "./components/PiePagina";

import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import DetalleProducto from "./pages/DetalleProducto";
import NoEncontrada from "./pages/NoEncontrada";

import { productos } from "./data/productos";

function App() {

  // Estado para filtrar los productos
  const [categoria, setCategoria] = useState("Todas");

  // Recuperar el carrito desde localStorage
  const [carrito, setCarrito] = useState(() => {
    const guardados = localStorage.getItem("carrito_los_maestros");

    const lista = guardados ? JSON.parse(guardados) : [];

    return lista.map((producto) => ({
      ...producto,
      cantidad: producto.cantidad || 1
    }));
  });

  // Guardar el carrito cada vez que cambie
  useEffect(() => {
    localStorage.setItem(
      "carrito_los_maestros",
      JSON.stringify(carrito)
    );
  }, [carrito]);

  // Filtrar productos según categoría
  const visibles = categoria === "Todas"
    ? productos
    : productos.filter(
        (producto) => producto.categoria === categoria
      );

  // Agregar productos al carrito
  function agregarAlCarrito(producto) {

    const existente = carrito.find(
      (item) => item.id === producto.id
    );

    if (existente) {

      if (existente.cantidad >= producto.stock) {
        alert("No hay más unidades disponibles.");
        return;
      }

      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );

    } else {

      if (producto.stock > 0) {
        setCarrito([
          ...carrito,
          { ...producto, cantidad: 1 }
        ]);
      }

    }
  }

  // Cambiar la cantidad de un producto
  function cambiarCantidad(id, nuevaCantidad) {

    const producto = carrito.find(
      (item) => item.id === id
    );

    if (!producto) return;

    if (nuevaCantidad < 1 ||
        nuevaCantidad > producto.stock) {
      return;
    }

    setCarrito(
      carrito.map((item) =>
        item.id === id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  }

  // Eliminar un producto del carrito
  function eliminarDelCarrito(id) {

    setCarrito(
      carrito.filter((item) => item.id !== id)
    );
  }

  // Vaciar el carrito
  function vaciarCarrito() {
    setCarrito([]);
  }

  // Calcular cantidad de artículos del carrito
  let cantidadCarrito = 0;

  carrito.forEach((producto) => {
    cantidadCarrito += producto.cantidad;
  });

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">

      <Cabecera />

      <Navegacion cantidadCarrito={cantidadCarrito} />

      <div className="flex-grow-1">
        <Routes>

          {/* Página principal */}
          <Route
            path="/"
            element={
              <main className="container py-4">

                <Bienvenida />

                <section className="my-5" id="catalogo">

                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-2">

                    <div>
                      <h2 className="h3 fw-bold mb-1">
                        Catálogo de Productos
                      </h2>

                      <p className="fw-bold mb-1">
                        Materiales y herramientas con entrega
                        inmediata en La Serena
                      </p>
                    </div>

                    <div style={{ minWidth: "220px" }}>

                      <Form.Select
                        value={categoria}
                        onChange={(evento) =>
                          setCategoria(evento.target.value)
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

                  <Row className="g-4">
                    {visibles.map((producto) => (
                      <Col
                        xs={12}
                        sm={6}
                        lg={3}
                        key={producto.id}
                      >
                        <TarjetaProducto
                          producto={producto}
                          onAgregar={agregarAlCarrito}
                        />
                      </Col>
                    ))}
                  </Row>

                </section>
              </main>
            }
          />

          {/* Detalle de producto */}
          <Route
            path="/producto/:id"
            element={<DetalleProducto />}
          />

          {/* Carrito de compras */}
          <Route
            path="/carrito"
            element={
              <Carrito
                carrito={carrito}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarDelCarrito}
                onVaciar={vaciarCarrito}
              />
            }
          />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={
              <Checkout
                carrito={carrito}
                onCompraExitosa={vaciarCarrito}
              />
            }
          />

          {/* Página no encontrada */}
          <Route
            path="*"
            element={<NoEncontrada />}
          />

        </Routes>
      </div>

      <PiePagina />

    </div>
  );
}

export default App;
