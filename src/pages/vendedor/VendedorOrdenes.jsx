// src/pages/vendedor/VendedorOrdenes.jsx
import { useState } from "react";
import MenuVendedor from "./MenuVendedor";

function VendedorOrdenes() {
  const [ordenes] = useState([
    { id: "#20240705", cliente: "Pedro Alvarado", fecha: "2026-10-10", total: 28775, estado: "Pagado" },
    { id: "#20240706", cliente: "Constructora Elqui", fecha: "2026-10-11", total: 154990, estado: "Pagado" },
    { id: "#20240707", cliente: "Javier Cruz", fecha: "2026-10-12", total: 45000, estado: "Pendiente" }
  ]);

  return (
    <div className="d-flex min-vh-100 bg-light w-100">
      {/* Menú exclusivo del Vendedor */}
      <MenuVendedor />

      <main className="flex-grow-1 p-4 overflow-auto">
        <header className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 fw-bold mb-1">Órdenes y Boletas Emitidas</h1>
            <p className="text-muted mb-0 small">Visualización y seguimiento de pedidos para el equipo de ventas.</p>
          </div>
          <span className="badge bg-primary fs-6">Total órdenes: {ordenes.length}</span>
        </header>

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
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((ord) => (
                  <tr key={ord.id}>
                    <td className="fw-bold">{ord.id}</td>
                    <td>{ord.cliente}</td>
                    <td>{ord.fecha}</td>
                    <td>${ord.total.toLocaleString("es-CL")}</td>
                    <td>
                      <span className={`badge ${ord.estado === "Pagado" ? "bg-success" : "bg-warning text-dark"}`}>
                        {ord.estado}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Detalle Boleta ${ord.id}\nCliente: ${ord.cliente}\nMonto: $${ord.total.toLocaleString("es-CL")}`)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Ver Boleta
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

export default VendedorOrdenes;