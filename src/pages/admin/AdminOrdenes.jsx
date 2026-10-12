// src/pages/admin/AdminOrdenes.jsx
import MenuAdmin from "./MenuAdmin";

function AdminOrdenes() {
  const ordenes = [
    { id: "#20240705", cliente: "Pedro Alvarado", fecha: "2026-10-10", total: 28775, estado: "Pagado" },
    { id: "#20240706", cliente: "Constructora Elqui", fecha: "2026-10-11", total: 154990, estado: "Pagado" }
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      <MenuAdmin/>
      <main className="flex-grow-1 p-4 overflow-auto">
        <h1 className="h4 fw-bold mb-3">Órdenes / Boletas</h1>
        <div className="card shadow-sm border-0 p-3 bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>N° Orden</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((ord) => (
                  <tr key={ord.id}>
                    <td className="fw-bold">{ord.id}</td>
                    <td>{ord.cliente}</td>
                    <td>{ord.fecha}</td>
                    <td>${ord.total.toLocaleString("es-CL")}</td>
                    <td><span className="badge bg-success">{ord.estado}</span></td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Mostrando Boleta ${ord.id} por $${ord.total.toLocaleString("es-CL")}`)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Mostrar Boleta
                      </button>
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

export default AdminOrdenes;