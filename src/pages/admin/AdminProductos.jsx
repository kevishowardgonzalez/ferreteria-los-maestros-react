import ControlInventario from "./ControlInventario";
import { useInventario } from "../../hooks/useInventario";
import { consultarExistencias, registrarFicha } from "../../services/inventario";
import { textoExistencias, stockCritico as esCritico } from "../../utils/existencias";
// src/pages/admin/AdminProductos.jsx
import { useState } from "react";
import MenuAdmin from "./MenuAdmin";
import FormularioProducto from "./FormularioProducto";
import { actualizarProducto, crearProducto, eliminarProducto as borrarProducto } from "../../services/productos";
import { useSesion } from "../../hooks/useSesion";


function AdminProductos({ productos = [], categorias = [], recargar, cargando, errorCarga, revision }) {
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [productoAEditar, setProductoAEditar] = useState(null);

  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const { usuario, rechazarCredencial } = useSesion();
  const puedeEditar = usuario?.rol === "ADMIN";
  const credencial = usuario?.token;
  const { fichas, estado } = useInventario(revision);
  const porProducto = new Map(fichas?.map((f) => [f.productoId, f]));
  const [altaIncierta, setAltaIncierta] = useState(false);

  async function guardarProducto(producto) {
    if (!puedeEditar || ocupado || (!productoAEditar && altaIncierta)) return false;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      if (productoAEditar) {
        await actualizarProducto(productoAEditar.id, producto, credencial);
        setMensaje("Información comercial actualizada.");
      } else {
        const nuevo = await crearProducto({ ...producto, stock: 0 }, credencial);
        if (!nuevo?.id) throw new Error("Alta incierta: verifica el catálogo antes de reintentar.");
        try {
          await registrarFicha(nuevo, producto.stock, credencial);
          setMensaje("Producto e inventario registrados.");
        } catch (errorFicha) {
          rechazarCredencial(errorFicha, credencial);
          try {
            await consultarExistencias(nuevo.id);
            setMensaje("Producto registrado y ficha recuperada.");
          } catch (consulta) {
            setError(consulta.estado === 404
              ? "Producto #" + nuevo.id + " creado con inventario pendiente. Completa la ficha en Existencias y movimientos. " + errorFicha.message
              : "Producto #" + nuevo.id + " creado. La ficha no pudo comprobarse; consulta Existencias y movimientos antes de reintentar.");
          }
        }
      }
      setProductoAEditar(null);
      recargar();
      return true;
    } catch (error) {
      rechazarCredencial(error, credencial);
      if (!productoAEditar && (!error.estado || error.estado >= 500)) {
        setAltaIncierta(true);
        setError("Alta comercial incierta. Verifica si el producto existe antes de repetirla.");
        recargar();
      } else {
        setError(error.message);
      }
      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function eliminarProducto(id) {
    if (!puedeEditar || ocupado || !window.confirm("¿Retirar este producto del catálogo? Se conservará su historial.")) return;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      await borrarProducto(id, credencial);
      if (productoAEditar?.id === id) setProductoAEditar(null);
      setMensaje("Producto retirado del catálogo.");
      recargar();
    } catch (error) {
      rechazarCredencial(error, credencial);
      setError(error.message);
    } finally {
      setOcupado(false);
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
      `Stock disponible: ${textoExistencias(estado, porProducto.get(prod.id))}\n` +
      `Descripción: ${prod.descripcion || "Sin descripción adicional"}`
    );
  }

  // FILTRO DE CONSULTA RÁPIDA
  const productosFiltrados = productos.filter(
    (item) =>
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const stockCritico = productos.filter((prod) => esCritico(porProducto.get(prod.id))).length;

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
              {!puedeEditar
                ? "Vista de consulta para equipo de ventas."
                : "Gestión completa: agregar, editar, consultar y eliminar existencias."}
            </p>
          </div>
          <span className="badge bg-primary fs-6">
            Total en catálogo: {productos.length}
          </span>
        </header>

        {/* Tarjetas KPI */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white h-100">
              <span className="text-muted small">Total de Productos</span>
              <p className="fs-3 fw-bold mb-0 text-primary">{productos.length}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white border-start border-danger border-4 h-100">
              <span className="text-danger small">Stock crítico según mínimo</span>
              <p className="fs-3 fw-bold mb-0 text-danger">{stockCritico}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white h-100">
              <span className="text-muted small">Categorías Activas</span>
              <p className="fs-3 fw-bold mb-0 text-success">{categorias.length}</p>
            </div>
          </div>
        </div>

        {(error || errorCarga) && <p role="alert">{error || errorCarga}</p>}
        {cargando && <p role="status">Cargando productos...</p>}
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
        {puedeEditar && (
          <section className="card shadow-sm border-0 p-4 mb-4 bg-white">
            <h2 className="h5 fw-bold mb-3">
              {productoAEditar ? `Editar Producto: ${productoAEditar.nombre}` : "Registrar Nuevo Producto"}
            </h2>
            {altaIncierta && <button type="button" className="btn btn-outline-secondary mb-2" onClick={() => setAltaIncierta(false)}>Ya verifiqué el catálogo</button>}
            <FormularioProducto
              categorias={categorias}
              ocupado={ocupado || (!productoAEditar && altaIncierta)}
              onGuardar={guardarProducto}
              productoAEditar={productoAEditar}
              onCancelarEdicion={() => setProductoAEditar(null)}
            />
          </section>
        )}

        {puedeEditar && <ControlInventario productos={productos} fichas={fichas} estado={estado}
          token={credencial} recargar={recargar} rechazarCredencial={rechazarCredencial} />}

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
                      <td>{textoExistencias(estado, porProducto.get(prod.id))}</td>
                      <td>
                        {!porProducto.has(prod.id) ? "—" : esCritico(porProducto.get(prod.id)) ? (
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
                          {puedeEditar && (
                            <button
                              type="button"
                              onClick={() => {
                                setProductoAEditar(prod);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="btn btn-outline-warning btn-sm"
                              title="Editar producto"
                              disabled={ocupado}
                            >
                              ✏️
                            </button>
                          )}

                          {/* ELIMINAR (Solo Admin) */}
                          {puedeEditar ? (
                            <button
                              type="button"
                              onClick={() => eliminarProducto(prod.id)}
                              className="btn btn-outline-danger btn-sm"
                              title="Retirar producto"
                              disabled={ocupado}
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
