// src/pages/admin/VistaAdmin.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { productos as listaInicial } from "../../data/productos";

function VistaAdmin() {
  const [lista, setLista] = useState(listaInicial);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [mensaje, setMensaje] = useState("");

  function manejarGuardar(e) {
    e.preventDefault();

    if (!nombre.trim() || !categoria || Number(precio) <= 0 || Number(stock) < 0) {
      alert("Por favor completa todos los campos correctamente.");
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      categoria,
      precio: Number(precio),
      stock: Number(stock),
      descripcion: "Ingresado desde panel de administración"
    };

    setLista([...lista, nuevoProducto]);
    setMensaje(`Producto "${nombre}" registrado con éxito.`);

    // Limpiar formulario
    setNombre("");
    setCategoria("");
    setPrecio("");
    setStock("");
  }

  function eliminarProducto(id) {
    if (confirm("¿Seguro que deseas eliminar este producto del inventario?")) {
      setLista(lista.filter((item) => item.id !== id));
    }
  }

  const stockCritico = lista.filter((prod) => prod.stock <= 5).length;

  return (
    <div className="d-flex flex-column flex-md-row flex-grow-1 min-vh-100">
      {/* 1. Menú Lateral del Administrador */}
      <aside
        className="bg-dark text-white p-3 d-flex flex-column"
        style={{ minWidth: "250px" }}
        aria-label="Navegación del administrador"
      >
        <div className="border-bottom pb-2 mb-3">
          <h2 className="h5 fw-bold text-warning mb-0">🔨 Admin Maestros</h2>
          <span className="badge bg-secondary mt-1">Rol: Administrador</span>
        </div>

        <nav className="flex-grow-1">
          <ul className="nav nav-pills flex-column gap-2">
            <li className="nav-item">
              <span className="nav-link active bg-warning text-dark fw-bold">
                📦 Inventario / Productos
              </span>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link text-light">
                🌐 Ver Tienda Pública
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-top pt-2 mt-auto">
          <Link
            to="/login"
            onClick={() => localStorage.removeItem("usuario_sesion")}
            className="btn btn-outline-danger btn-sm w-100"
          >
            🚪 Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* 2. Área Central del Administrador */}
      <main className="container-fluid py-4 px-md-4 bg-light flex-grow-1">
        <header className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h3 fw-bold mb-1">Panel de Administración</h1>
            <p className="text-muted mb-0 small">
              Gestión de inventario y existencias de faena en La Serena.
            </p>
          </div>
          <span className="badge bg-primary fs-6">
            Total en catálogo: {lista.length}
          </span>
        </header>

        {/* Tarjetas KPI de resumen */}
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

        {/* Formulario para agregar producto */}
        <section className="card shadow-sm border-0 p-4 mb-4">
          <h2 className="h5 fw-bold mb-3">Registrar Nuevo Producto</h2>
          <form onSubmit={manejarGuardar}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold">Nombre del producto *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Taladro Percutor 20V"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Categoría *</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                >
                  <option value="">Selecciona categoría</option>
                  <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
                  <option value="Construcción">Construcción</option>
                  <option value="Herramientas Manuales">Herramientas Manuales</option>
                  <option value="Gasfitería">Gasfitería</option>
                  <option value="Pinturas">Pinturas</option>
                  <option value="Electricidad">Electricidad</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Precio ($ CLP) *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Ej: 59990"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold">Stock inicial *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Ej: 15"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-warning fw-bold mt-3 px-4">
              Guardar Producto
            </button>
          </form>
        </section>

        {/* Tabla de Inventario */}
        <section className="card shadow-sm border-0 p-4">
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

export default VistaAdmin;