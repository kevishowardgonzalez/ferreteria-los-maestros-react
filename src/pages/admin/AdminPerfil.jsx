// src/pages/admin/AdminPerfil.jsx
import { useState } from "react";
import MenuAdmin from "./MenuAdmin";
import { Form, Button } from "react-bootstrap";
import { etiquetasRol, useSesion } from "../../components/SesionProvider";

function AdminPerfil() {
  const { usuario } = useSesion();
  const [nombre, setNombre] = useState(() => [usuario.nombre, usuario.apellido].filter(Boolean).join(" "));
  const [cargo, setCargo] = useState(etiquetasRol[usuario.rol]);

  function guardar(e) {
    e.preventDefault();
    alert("Perfil actualizado correctamente");
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <MenuAdmin/>
      <main className="flex-grow-1 p-4 overflow-auto">
        <h1 className="h4 fw-bold mb-3">Perfil de Usuario</h1>
        <div className="card shadow-sm border-0 p-4 bg-white" style={{ maxWidth: "500px" }}>
          <Form onSubmit={guardar}>
            <Form.Group className="mb-3" controlId="perfilNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="perfilCorreo">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" value={usuario.correo} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="perfilCargo">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="warning" className="fw-bold">
              Guardar Cambios
            </Button>
          </Form>
        </div>
      </main>
    </div>
  );
}

export default AdminPerfil;
