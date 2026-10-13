// src/pages/admin/AdminProductos.jsx
import { useState } from "react";
import MenuAdmin from "./MenuAdmin";
import FormularioProducto from "./FormularioProducto";
import { productos as listaInicial } from "../../data/productos";

function AdminProductos() {
  const [lista, setLista] = useState(listaInicial);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [productoAEditar, setProductoAEditar] = useState(null);

  const sesionGuardada = localStorage.getItem("usuario_sesion");
  const usuario = sesionGuardada ? JSON.parse(sesionGuardada) : null;
  const esVendedor = usuario?.rol === "Vendedor";

  // AGREGAR O ACTUALIZAR (EDITAR)
  function guardarProducto(producto) {
    if (productoAEditar) {
      setLista(lista.map((item) => (item.id === producto.id ? producto : item)));
      setMensaje(`Producto "${producto.nombre}" actualizado con éxito.`);
      setProductoAEditar(null);
    } else {
      setLista([...lista, producto]);
      setMensaje(`Producto "${producto.nombre}" registrado con éxito.`);
    }
  }

  // ELIMINAR
  function eliminarProducto(id) {
    if (confirm("¿Seguro que deseas eliminar este producto del inventario?")) {
      setLista(lista.filter((item) => item.id !== id));
      if (productoAEditar?.id === id) setProductoAEditar(null);
      setMensaje("Producto eliminado correctamente.");
    }
  }

  // CONSULTAR DETALLE
  function verDetalle(prod) {
    alert(
      `Ficha Técnica / Consulta de Producto:\n` +
      `ID: #${prod.id}\n` +
      `Nombre: ${prod.nombre}\n` +
      `Categoría: ${prod.categoria}\n` +
      `Precio: $${prod.precio.toLocaleString("es-CL")}\n` +
      `Stock Disponible: ${prod.stock} unidades\n` +
      `Descripción: ${prod.descripcion || "Sin descripción adicional"}`
    );
  }

  // FILTRO DE CONSULTA RÁPIDA
  const productosFiltrados = lista.filter(
    (item) =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const stockCritico = lista.filter((prod) => prod.stock <= 5).length;

  return (
    <div className="d-flex min-vh-100 bg-light w-100">
      {/* Menú lateral */}
      <MenuAdmin />

      {/* Contenido principal */}
      <main className="flex-grow-1 p-4 overflow-auto" style={{ minWidth: 0 }}>
        <header className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h4 fw-bold mb-1">Inventario y Catálogo de Productos</h1>
            <p className="text-muted mb-0 small">
              {esVendedor
                ? "Vista de consulta para equipo de ventas."
                : "Gestión completa: agregar, editar, consultar y eliminar existencias."}
            </p>
          </div>
          <span className="badge bg-primary fs-6">
            Total en catálogo: {lista.length}
          </span>
        </header>

        {/* Tarjetas KPI */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white h-100">
              <span className="text-muted small">Total de Productos</span>
              <p className="fs-3 fw-bold mb-0 text-primary">{lista.length}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white border-start border-danger border-4 h-100">
              <span className="text-danger small">Stock Crítico (≤ 5 unidades)</span>
              <p className="fs-3 fw-bold mb-0 text-danger">{stockCritico}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white h-100">
              <span className="text-muted small">Categorías Activas</span>
              <p className="fs-3 fw-bold mb-0 text-success">6</p>
            </div>
          </div>
        </div>

        {mensaje && (
          <div className="alert alert-success alert-dismissible fade show py-2" role="alert">
            {mensaje}
            <button
              type="button"
              className="btn-close py-2"
              onClick={() => setMensaje("")}
              aria-label="Cerrar"
            ></button>
          </div>
        )}

        {/* Formulario (Crear / Editar) solo visible para Administrador */}
        {!esVendedor && (
          <section className="card shadow-sm border-0 p-4 mb-4 bg-white">
            <h2 className="h5 fw-bold mb-3">
              {productoAEditar ? `Editar Producto: ${productoAEditar.nombre}` : "Registrar Nuevo Producto"}
            </h2>
            <FormularioProducto
              onGuardar={guardarProducto}
              productoAEditar={productoAEditar}
              onCancelarEdicion={() => setProductoAEditar(null)}
            />
          </section>
        )}

        {/* Listado y Búsqueda de Productos */}
        <section className="card shadow-sm border-0 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="h5 fw-bold mb-0">Listado de Inventario Actual</h2>
            <div style={{ maxWidth: "300px" }} className="w-100">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="🔍 Buscar por nombre o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-3">
                      No se encontraron productos coincidentes.
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((prod) => (
                    <tr key={prod.id}>
                      <td className="fw-semibold">{prod.nombre}</td>
                      <td>{prod.categoria}</td>
                      <td>${prod.precio.toLocaleString("es-CL")}</td>
                      <td>{prod.stock}</td>
                      <td>
                        {prod.stock <= 5 ? (
                          <span className="badge bg-danger">Crítico</span>
                        ) : (
                          <span className="badge bg-success">Normal</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          {/* CONSULTAR */}
                          <button
                            type="button"
                            onClick={() => verDetalle(prod)}
                            className="btn btn-outline-info btn-sm"
                            title="Consultar ficha"
                          >
                            👁️
                          </button>

                          {/* EDITAR (Solo Admin) */}
                          {!esVendedor && (
                            <button
                              type="button"
                              onClick={() => {
                                setProductoAEditar(prod);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="btn btn-outline-warning btn-sm"
                              title="Editar producto"
                            >
                              ✏️
                            </button>
                          )}

                          {/* ELIMINAR (Solo Admin) */}
                          {!esVendedor ? (
                            <button
                              type="button"
                              onClick={() => eliminarProducto(prod.id)}
                              className="btn btn-outline-danger btn-sm"
                              title="Eliminar producto"
                            >
                              🗑️
                            </button>
                          ) : (
                            <span className="badge bg-secondary">Solo lectura</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminProductos;