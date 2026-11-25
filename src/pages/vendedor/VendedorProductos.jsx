import { useInventario } from "../../hooks/useInventario";
import { textoExistencias, stockCritico as esCritico } from "../../utils/existencias";
// src/pages/vendedor/VendedorProductos.jsx
import MenuVendedor from "./MenuVendedor";

function VendedorProductos({ productos = [], cargando, error, revision }) {
  const { fichas, estado } = useInventario(revision);
  const porProducto = new Map(fichas?.map((ficha) => [ficha.productoId, ficha]));
  const stockCritico = productos.filter((p) => esCritico(porProducto.get(p.id))).length;

  return (
    <div className="d-flex min-vh-100 bg-light w-100">
      <MenuVendedor />

      <main className="flex-grow-1 p-4 overflow-auto">
        <header className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 fw-bold mb-1">Inventario (Consulta de Ventas)</h1>
            <p className="text-muted mb-0 small">Visualización autorizada de stock y precios.</p>
          </div>
          <span className="badge bg-primary fs-6">Stock crítico: {stockCritico}</span>
        </header>

        <div className="card shadow-sm border-0 p-3 bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {(cargando || error || productos.length === 0) && (
                  <tr><td colSpan={6}>{cargando ? <span role="status">Cargando productos...</span> :
                    error ? <span role="alert">{error}</span> : "No hay productos."}</td></tr>
                )}
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td className="fw-semibold">{prod.nombre}</td>
                    <td>{prod.categoria}</td>
                    <td>${prod.precio.toLocaleString("es-CL")}</td>
                    <td>{textoExistencias(estado, porProducto.get(prod.id))}</td>
                    <td>{porProducto.get(prod.id)?.stockMinimo ?? "—"}</td>
                    <td>
                      {!porProducto.has(prod.id) ? "—" : esCritico(porProducto.get(prod.id)) ? (
                        <span className="badge bg-danger">Crítico</span>
                      ) : (
                        <span className="badge bg-success">Disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VendedorProductos;
