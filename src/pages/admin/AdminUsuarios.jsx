// src/pages/admin/AdminUsuarios.jsx
import { useState } from "react";
import MenuAdmin from "./MenuAdmin";

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, run: "12345678-5", nombre: "Kevis Admin", correo: "admin@duoc.cl", rol: "Administrador" },
    { id: 2, run: "19876543-2", nombre: "Carlos Maestro", correo: "carlos@gmail.com", rol: "Cliente" },
    { id: 3, run: "15987456-3", nombre: "Marcos Rodríguez", correo: "m.rodriguez@duoc.cl", rol: "Vendedor" }
  ]);

  function eliminarUsuario(id) {
    if (confirm("¿Dar de baja a este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <MenuAdmin/>
      <main className="flex-grow-1 p-4 overflow-auto">
        <h1 className="h4 fw-bold mb-3">Gestión de Usuarios</h1>
        <div className="card shadow-sm border-0 p-3 bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>RUN</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.run}</td>
                    <td className="fw-semibold">{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={`badge ${u.rol === "Administrador" ? "bg-primary" : "bg-secondary"}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => eliminarUsuario(u.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Baja
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

export default AdminUsuarios;