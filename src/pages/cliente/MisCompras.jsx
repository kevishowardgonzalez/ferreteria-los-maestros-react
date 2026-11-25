// src/pages/cliente/MisCompras.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MisCompras() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const guardadas = localStorage.getItem("ordenes_compras_cliente");
    if (guardadas) {
      setCompras(JSON.parse(guardadas));
    } else {
      // Datos de ejemplo iniciales
      const iniciales = [
        { id: "#20261010", fecha: "2026-10-10", total: 28775, items: "Taladro Percutor (1), Cemento (2)", estado: "Entregado" },
        { id: "#20261012", fecha: "2026-10-12", total: 15490, items: "Set de Herramientas (1)", estado: "En Despacho" }
      ];
      setCompras(iniciales);
      localStorage.setItem("ordenes_compras_cliente", JSON.stringify(iniciales));
    }
  }, []);

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h4 fw-bold mb-1">Mis Compras</h1>
          <p className="text-muted mb-0 small">Historial de órdenes y boletas generadas para tu cuenta.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/cliente/perfil" className="btn btn-outline-secondary btn-sm fw-semibold">
            👤 Mi Perfil
          </Link>
          <Link to="/productos" className="btn btn-warning btn-sm fw-bold">
            🛒 Seguir Comprando
          </Link>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-3 bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>N° Pedido</th>
                <th>Fecha</th>
                <th>Detalle de Productos</th>
                <th>Total Pagado</th>
                <th>Estado</th>
                <th className="text-center">Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id}>
                  <td className="fw-bold text-primary">{c.id}</td>
                  <td>{c.fecha}</td>
                  <td>{c.items}</td>
                  <td className="fw-semibold">${c.total.toLocaleString("es-CL")}</td>
                  <td>
                    <span className={`badge ${c.estado === "Entregado" ? "bg-success" : "bg-warning text-dark"}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => alert(`Boleta ${c.id}\nFecha: ${c.fecha}\nTotal: $${c.total.toLocaleString("es-CL")}\nEstado: ${c.estado}`)}
                      className="btn btn-outline-dark btn-sm"
                    >
                      📄 Ver Boleta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default MisCompras;