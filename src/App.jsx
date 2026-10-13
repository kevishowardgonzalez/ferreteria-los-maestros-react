// src/App.jsx
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
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import DetalleBlog1 from "./pages/DetalleBlog1";
import DetalleBlog2 from "./pages/DetalleBlog2";

// Subsistema administrativo
import HomeAdmin from "./pages/admin/HomeAdmin";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminOrdenes from "./pages/admin/AdminOrdenes";
import AdminReportes from "./pages/admin/AdminReportes";
import AdminPerfil from "./pages/admin/AdminPerfil";

// Vendedor
import VendedorProductos from "./pages/vendedor/VendedorProductos";
import VendedorOrdenes from "./pages/vendedor/VendedorOrdenes";

// Cliente
import MisCompras from "./pages/cliente/MisCompras";
import PerfilCliente from "./pages/cliente/PerfilCliente";

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

  const visibles =
    categoria === "Todas"
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

  const cantidadTotalCarrito = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  // 1. Portada
  const vistaInicio = (
    <main className="container py-4 text-center">
      <Bienvenida />
      <div className="mt-4">
        <Button as={Link} to="/productos" variant="warning" size="lg" className="fw-bold">
          Ver Catálogo Completo de Productos
        </Button>
      </div>
    </main>
  );

  // 2. Catálogo con filtro
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
    <Routes>
      {/* VISTAS DE LA TIENDA PÚBLICA (Con cabecera y barra de navegación) */}
      <Route
        path="/"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1">{vistaInicio}</div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/productos"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1">{vistaCatalogo}</div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/productos/:id"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><DetalleProducto /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/carrito"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1">
              <Carrito
                carrito={carrito}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarDelCarrito}
                onVaciar={vaciarCarrito}
              />
            </div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/checkout"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1">
              <Checkout carrito={carrito} onCompraExitosa={vaciarCarrito} />
            </div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/nosotros"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><Nosotros /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/blogs"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><Blogs /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/blogs/1"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><DetalleBlog1 /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/blogs/2"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><DetalleBlog2 /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/contacto"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><Contacto /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><Login /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/registro"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><Registro /></div>
            <PiePagina />
          </div>
        }
      />

      {/* VISTAS EXCLUSIVAS DE CLIENTE */}
      <Route
        path="/cliente/compras"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><MisCompras /></div>
            <PiePagina />
          </div>
        }
      />
      <Route
        path="/cliente/perfil"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><PerfilCliente /></div>
            <PiePagina />
          </div>
        }
      />

      {/* RUTAS DE ADMINISTRADOR (Panel limpio e independiente) */}
      <Route path="/admin" element={<HomeAdmin />} />
      <Route path="/admin/productos" element={<AdminProductos />} />
      <Route path="/admin/usuarios" element={<AdminUsuarios />} />
      <Route path="/admin/categorias" element={<AdminCategorias />} />
      <Route path="/admin/ordenes" element={<AdminOrdenes />} />
      <Route path="/admin/reportes" element={<AdminReportes />} />
      <Route path="/admin/perfil" element={<AdminPerfil />} />

      {/* RUTAS DE VENDEDOR (Panel limpio e independiente) */}
      <Route path="/vendedor/productos" element={<VendedorProductos />} />
      <Route path="/vendedor/ordenes" element={<VendedorOrdenes />} />

      {/* RUTA 404 */}
      <Route
        path="*"
        element={
          <div className="bg-light min-vh-100 d-flex flex-column">
            <Cabecera />
            <Navegacion cantidadCarrito={cantidadTotalCarrito} />
            <div className="flex-grow-1"><NoEncontrada /></div>
            <PiePagina />
          </div>
        }
      />
    </Routes>
  );
}

export default App;