// src/App.jsx
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

// 1. Custom Hooks de lógica desacoplada
import { useProductos } from "./hooks/useProductos";
import { useCarrito } from "./hooks/useCarrito";

// 2. Componentes estructurales y de tienda (en ./components/)
import Cabecera from "./components/Cabecera";
import Navegacion from "./components/Navegacion";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import Catalogo from "./components/Catalogo";
import Carrito from "./components/Carrito";
import Checkout from "./components/Checkout";
import CompraExitosa from "./components/CompraExitosa";
import CompraFallida from "./components/CompraFallida";
import DetalleProducto from "./components/DetalleProducto";

// 3. Páginas públicas (en ./pages/)
import NoEncontrada from "./pages/NoEncontrada";
import Nosotros from "./pages/Nosotros";
import Blogs from "./pages/Blogs";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import DetalleBlog1 from "./pages/DetalleBlog1";
import DetalleBlog2 from "./pages/DetalleBlog2";

// 4. Subsistema administrativo
import HomeAdmin from "./pages/admin/HomeAdmin";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminOrdenes from "./pages/admin/AdminOrdenes";
import AdminReportes from "./pages/admin/AdminReportes";
import AdminPerfil from "./pages/admin/AdminPerfil";

// 5. Subsistema vendedor
import VendedorProductos from "./pages/vendedor/VendedorProductos";
import VendedorOrdenes from "./pages/vendedor/VendedorOrdenes";

// 6. Subsistema cliente
import MisCompras from "./pages/cliente/MisCompras";
import PerfilCliente from "./pages/cliente/PerfilCliente";

// Layout común para la tienda pública (evita repetir cabecera/navbar 15 veces)
function LayoutTienda({ cantidadCarrito }) {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Cabecera />
      <Navegacion cantidadCarrito={cantidadCarrito} />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <PiePagina />
    </div>
  );
}

function App() {
  // Estado y filtros de inventario gestionados por el Hook
  const {
    productos,
    setProductos,
    categoria,
    setCategoria,
    visibles,
  } = useProductos();

  // Estado y funciones del carrito gestionados por el Hook
  const {
    carrito,
    cantidadTotalCarrito,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCarrito();

  return (
    <Routes>
      {/* ---------------- 1. RUTAS DE LA TIENDA PÚBLICA ---------------- */}
      <Route element={<LayoutTienda cantidadCarrito={cantidadTotalCarrito} />}>
        {/* Portada */}
        <Route
          path="/"
          element={
            <main className="container py-4 text-center">
              <Bienvenida />
              <div className="mt-4">
                <Button as={Link} to="/productos" variant="warning" size="lg" className="fw-bold">
                  Ver Catálogo Completo de Productos
                </Button>
              </div>
            </main>
          }
        />

        {/* Catálogo con selector de categoría */}
        <Route
          path="/productos"
          element={
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
          }
        />

        {/* Detalle dinámico de producto */}
        <Route path="/productos/:id" element={<DetalleProducto productos={productos} />} />

        {/* Flujo de compras */}
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
          element={<Checkout carrito={carrito} onCompraExitosa={vaciarCarrito} />}
        />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/compra-fallida" element={<CompraFallida />} />

        {/* Páginas informativas e institucionales */}
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/1" element={<DetalleBlog1 />} />
        <Route path="/blogs/2" element={<DetalleBlog2 />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Vistas de cliente */}
        <Route path="/cliente/compras" element={<MisCompras />} />
        <Route path="/cliente/perfil" element={<PerfilCliente />} />

        {/* 404 */}
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* ---------------- 2. PANEL ADMINISTRATIVO ---------------- */}
      <Route path="/admin" element={<HomeAdmin />} />
      <Route
        path="/admin/productos"
        element={<AdminProductos productos={productos} setProductos={setProductos} />}
      />
      <Route path="/admin/usuarios" element={<AdminUsuarios />} />
      <Route path="/admin/categorias" element={<AdminCategorias />} />
      <Route path="/admin/ordenes" element={<AdminOrdenes />} />
      <Route path="/admin/reportes" element={<AdminReportes />} />
      <Route path="/admin/perfil" element={<AdminPerfil />} />

      {/* ---------------- 3. PANEL DE VENDEDOR ---------------- */}
      <Route path="/vendedor/productos" element={<VendedorProductos />} />
      <Route path="/vendedor/ordenes" element={<VendedorOrdenes />} />
    </Routes>
  );
}

export default App;