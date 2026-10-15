// src/pages/admin/AdminReportes.jsx
import MenuAdmin from "./MenuAdmin";

function AdminReportes() {
  return (
    <div className="d-flex min-vh-100 bg-light">
     <MenuAdmin/>
      <main className="flex-grow-1 p-4 overflow-auto">
        <h1 className="h4 fw-bold mb-3">Reportes del Sistema</h1>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white">
              <h2 className="h6 text-muted mb-1">Ventas del Mes</h2>
              <p className="fs-3 fw-bold mb-0 text-success">$183.765</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 p-3 bg-white">
              <h2 className="h6 text-muted mb-1">Stock Valorizado</h2>
              <p className="fs-3 fw-bold mb-0 text-primary">$4.850.000</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminReportes;