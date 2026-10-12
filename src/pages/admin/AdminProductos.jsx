// src/pages/admin/AdminProductos.jsx
import { useState } from "react";
import FormularioProducto from "./FormularioProducto";
import { productos as listaInicial } from "../../data/productos";
import MenuAdmin from "./MenuAdmin";

function AdminProductos() {
  const [lista, setLista] = useState(listaInicial);
  const [mensaje, setMensaje] = useState("");

  function agregarProducto(nuevo) {
    setLista([...lista, nuevo]);
    setMensaje(`Producto "${nuevo.nombre}" guardado con éxito.`);
  }

  function eliminarProducto(id) {
    if (confirm("¿Seguro que deseas eliminar este producto del inventario?")) {
      setLista(lista.filter((item) => item.id !== id));
    }
  }

  const stockCritico = lista.filter((prod) => prod.stock <= 5).length;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Menú lateral unificado */}
      <MenuAdmin />

      {/* Contenido principal */}
      <main className="flex-grow-1 p-4 overflow-auto">
        <header className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h4 fw-bold mb-1">Inventario y Catálogo de Productos</h1>
            <p className="text-muted mb-0 small">Gestión y control de existencias en faena.</p>
          </div>
          <span className="badge bg-primary fs-6">
            Total en catálogo: {lista.length}
          </span>
        </header>

        {/* Tarjetas KPI */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white">
              <h2 className="h6 text-muted mb-1">Total de Productos</h2>
              <p className="fs-3 fw-bold mb-0 text-primary">{lista.length}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white border-start border-danger border-4">
              <h2 className="h6 text-danger mb-1">Stock Crítico (≤ 5 unidades)</h2>
              <p className="fs-3 fw-bold mb-0 text-danger">{stockCritico}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white">
              <h2 className="h6 text-muted mb-1">Categorías Activas</h2>
              <p className="fs-3 fw-bold mb-0 text-success">6</p>
            </div>
          </div>
        </div>

        {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

        {/* Formulario controlado traído como componente */}
        <section className="card shadow-sm border-0 p-4 mb-4 bg-white">
          <h2 className="h5 fw-bold mb-3">Registrar Nuevo Producto</h2>
          <FormularioProducto onGuardar={agregarProducto} />
        </section>

        {/* Tabla de Inventario */}
        <section className="card shadow-sm border-0 p-4 bg-white">
          <h2 className="h5 fw-bold mb-3">Listado de Inventario Actual</h2>
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
                {lista.map((prod) => (
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
                      <button
                        type="button"
                        onClick={() => eliminarProducto(prod.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminProductos;