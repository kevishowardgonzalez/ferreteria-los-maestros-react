
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import Catalogo from "./pages/Catalogo";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import AdminProductos from "./pages/admin/AdminProductos";
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import { productos as listaInicial } from "./data/productos";
import { guardarCarrito } from "./utils/persistencia";
import { Form, Button } from "react-bootstrap";

function App() {
  const [productos] = useState(listaInicial);
  const [categoria, setCategoria] = useState("Todas");
  const [carrito, setCarrito] = useState(() => {
    const guardados = localStorage.getItem("carrito_los_maestros");
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  const visibles = categoria === "Todas"
    ? productos
    : productos.filter((prod) => prod.categoria === categoria);

  function agregarAlCarrito(producto) {
    const itemExistente = carrito.find((item) => item.id === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        cambiarCantidad(producto.id, itemExistente.cantidad + 1);
      } else {
        alert("No hay más stock disponible de este producto.");
      }
      return;
    }
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  }

  function cambiarCantidad(id, nuevaCantidad) {
    setCarrito(
      carrito.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito(carrito.filter((item) => item.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const cantidadTotalCarrito = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // 1. Vista de Inicio (Portada institucional con botón directo al catálogo)
  const vistaInicio = (
    <main className="container py-4 text-center">
      <Bienvenida />
      <div className="mt-4">
        <Button as={Link} to="/productos" variant="warning" size="lg" className="fw-bold">
          Ver Catálogo Completo de Productosss
        </Button>
      </div>
    </main>
  );

  // 2. Vista del Catálogo (Filtro por categoría + tarjetas de productos)
  const vistaCatalogo = (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">Catálogo de Materiales y Herramientas</h1>
          <p className="text-muted mb-0">Explora nuestro stock para faenas y obras en La Serena.</p>
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
      <Catalogo productos={visibles} onAgregar={agregarAlCarrito} />
    </main>
  );

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Cabecera />
      <Navegacion cantidadCarrito={cantidadTotalCarrito} />

      <div className="flex-grow-1">
        <Routes>
          {/* Portada y Catálogo diferenciados */}
          <Route path="/" element={vistaInicio} />
          <Route path="/productos" element={vistaCatalogo} />
          
          {/* Ficha dinámica, carrito y checkout */}
          <Route path="/productos/:id" element={<DetalleProducto />} />
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
          <Route
            path="/checkout"
            element={
              <Checkout
                carrito={carrito}
                onCompraExitosa={vaciarCarrito}
              />
            }
          />

          {/* Panel administrativo y páginas informativas */}
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Manejo de rutas inexistentes */}
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </div>

      <PiePagina />
    </div>
  );
}

export default App;