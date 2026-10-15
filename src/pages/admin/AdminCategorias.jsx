// src/pages/admin/AdminCategorias.jsx
import { useState } from "react";
import MenuAdmin from "./MenuAdmin";
import { Form, Button } from "react-bootstrap";

function AdminCategorias() {
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Herramientas Eléctricas", total: 4 },
    { id: 2, nombre: "Construcción", total: 3 },
    { id: 3, nombre: "Herramientas Manuales", total: 2 },
    { id: 4, nombre: "Gasfitería", total: 1 },
    { id: 5, nombre: "Pinturas", total: 2 },
    { id: 6, nombre: "Electricidad", total: 1 }
  ]);
  const [nombreCat, setNombreCat] = useState("");

  function agregarCategoria(e) {
    e.preventDefault();
    if (!nombreCat.trim()) return;
    setCategorias([
      ...categorias,
      { id: Date.now(), nombre: nombreCat.trim(), total: 0 }
    ]);
    setNombreCat("");
  }

  function eliminarCategoria(id) {
    if (confirm("¿Deseas eliminar esta categoría?")) {
      setCategorias(categorias.filter((c) => c.id !== id));
    }
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <MenuAdmin/>
      <main className="flex-grow-1 p-4 overflow-auto">
        <h1 className="h4 fw-bold mb-3">Gestión de Categorías</h1>

        <div className="card shadow-sm border-0 p-4 mb-4 bg-white">
          <h2 className="h5 fw-bold mb-3">Nueva Categoría</h2>
          <Form onSubmit={agregarCategoria} className="d-flex gap-2">
            <Form.Group controlId="nombreCat" className="flex-grow-1">
              <Form.Control
                type="text"
                placeholder="Ej: Fijaciones y Tornillos"
                value={nombreCat}
                onChange={(e) => setNombreCat(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="warning" className="fw-bold">
              Guardar
            </Button>
          </Form>
        </div>

        <div className="card shadow-sm border-0 p-3 bg-white">
          <h2 className="h5 fw-bold mb-3">Listado de Categorías</h2>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Categoría</th>
                  <th>Productos</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((cat) => (
                  <tr key={cat.id}>
                    <td>#{cat.id}</td>
                    <td className="fw-semibold">{cat.nombre}</td>
                    <td><span className="badge bg-secondary">{cat.total}</span></td>
                    <td className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarCategoria(cat.id)}
                      >
                        Eliminar
                      </Button>
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

export default AdminCategorias;