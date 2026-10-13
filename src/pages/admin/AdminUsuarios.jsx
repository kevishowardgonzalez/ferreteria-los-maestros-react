// src/pages/admin/AdminUsuarios.jsx
import { useState, useEffect } from "react";
import MenuAdmin from "./MenuAdmin";
import { Form, Button, Table, Badge, Card, Row, Col } from "react-bootstrap";

const usuariosIniciales = [
  {
    id: 1,
    rut: "12345678-5",
    nombre: "Kevis Howard",
    correo: "admin@duoc.cl",
    rol: "Administrador",
    estado: "Activo"
  },
  {
    id: 2,
    rut: "15987456-3",
    nombre: "Javier Cruz",
    correo: "vendedor@duoc.cl",
    rol: "Vendedor",
    estado: "Activo"
  },
  {
    id: 3,
    rut: "19876543-2",
    nombre: "Yerickson Rodríguez",
    correo: "yerickson@gmail.com",
    rol: "Cliente",
    estado: "Activo"
  }
];

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem("usuarios_sistema");
    return guardados ? JSON.parse(guardados) : usuariosIniciales;
  });

  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [datosForm, setDatosForm] = useState({
    rut: "",
    nombre: "",
    correo: "",
    rol: "Cliente"
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    localStorage.setItem("usuarios_sistema", JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (usuarioAEditar) {
      setDatosForm({
        rut: usuarioAEditar.rut,
        nombre: usuarioAEditar.nombre,
        correo: usuarioAEditar.correo,
        rol: usuarioAEditar.rol
      });
    } else {
      setDatosForm({ rut: "", nombre: "", correo: "", rol: "Cliente" });
    }
  }, [usuarioAEditar]);

  function cambiar(e) {
    const { name, value } = e.target;
    setDatosForm({ ...datosForm, [name]: value });
  }

  // 1. CREAR O MODIFICAR (EDITAR) USUARIO
  function guardarUsuario(e) {
    e.preventDefault();
    const nuevosErrores = {};

    if (!datosForm.rut.trim()) nuevosErrores.rut = "El RUT es obligatorio";
    if (!datosForm.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!datosForm.correo.includes("@")) nuevosErrores.correo = "Ingresa un correo válido";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    if (usuarioAEditar) {
      // Modificar existente
      setUsuarios(
        usuarios.map((u) =>
          u.id === usuarioAEditar.id ? { ...u, ...datosForm } : u
        )
      );
      setMensaje(`Usuario "${datosForm.nombre}" actualizado con éxito.`);
      setUsuarioAEditar(null);
    } else {
      // Crear nuevo con rol asignado
      const nuevo = {
        id: Date.now(),
        ...datosForm,
        estado: "Activo"
      };
      setUsuarios([...usuarios, nuevo]);
      setMensaje(`Usuario "${datosForm.nombre}" creado exitosamente.`);
    }

    setDatosForm({ rut: "", nombre: "", correo: "", rol: "Cliente" });
  }

  // 2. DAR DE BAJA (ELIMINAR) USUARIO
  function eliminarUsuario(id, nombre) {
    if (confirm(`¿Estás seguro de que deseas dar de baja al usuario "${nombre}"?`)) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
      if (usuarioAEditar?.id === id) setUsuarioAEditar(null);
      setMensaje(`El usuario "${nombre}" ha sido dado de baja.`);
    }
  }

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="d-flex min-vh-100 bg-light w-100">
      <MenuAdmin />

      <main className="flex-grow-1 p-4 overflow-auto" style={{ minWidth: 0 }}>
        <header className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h4 fw-bold mb-1">Gestión de Usuarios y Roles</h1>
            <p className="text-muted mb-0 small">
              Administración de accesos: crear cuentas con rol, modificar y dar de baja.
            </p>
          </div>
          <span className="badge bg-primary fs-6">
            Total usuarios: {usuarios.length}
          </span>
        </header>

        {mensaje && (
          <div className="alert alert-success alert-dismissible fade show py-2" role="alert">
            {mensaje}
            <button
              type="button"
              className="btn-close py-2"
              onClick={() => setMensaje("")}
            ></button>
          </div>
        )}

        {/* FORMULARIO PARA CREAR / EDITAR CON SELECTOR DE ROL */}
        <Card className="shadow-sm border-0 p-4 mb-4 bg-white">
          <h2 className="h5 fw-bold mb-3">
            {usuarioAEditar ? `Editar Usuario: ${usuarioAEditar.nombre}` : "Registrar Nuevo Usuario"}
          </h2>
          <Form onSubmit={guardarUsuario} noValidate>
            <Row className="g-3">
              <Col xs={12} md={3}>
                <Form.Group controlId="rut">
                  <Form.Label>RUT</Form.Label>
                  <Form.Control
                    name="rut"
                    value={datosForm.rut}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.rut)}
                    placeholder="Ej: 12345678-5"
                  />
                  <Form.Control.Feedback type="invalid">{errores.rut}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group controlId="nombre">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={datosForm.nombre}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.nombre)}
                    placeholder="Ej: Kevis Howard"
                  />
                  <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col xs={12} md={3}>
                <Form.Group controlId="correo">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={datosForm.correo}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.correo)}
                    placeholder="correo@duoc.cl"
                  />
                  <Form.Control.Feedback type="invalid">{errores.correo}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* SELECTOR DE ROL */}
              <Col xs={12} md={3}>
                <Form.Group controlId="rol">
                  <Form.Label>Asignar Rol</Form.Label>
                  <Form.Select name="rol" value={datosForm.rol} onChange={cambiar}>
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Cliente">Cliente</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-3">
              <Button type="submit" variant="warning" className="fw-bold">
                {usuarioAEditar ? "Actualizar Datos" : "Crear Usuario"}
              </Button>
              {usuarioAEditar && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setUsuarioAEditar(null)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </Form>
        </Card>

        {/* TABLA DE USUARIOS */}
        <Card className="shadow-sm border-0 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h2 className="h5 fw-bold mb-0">Listado de Usuarios Registrados</h2>
            <div style={{ maxWidth: "300px" }} className="w-100">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="🔍 Buscar por nombre, correo o rol..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td>{u.rut}</td>
                    <td className="fw-semibold">{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <Badge
                        bg={
                          u.rol === "Administrador"
                            ? "warning"
                            : u.rol === "Vendedor"
                              ? "info"
                              : "success"
                        }
                        text={u.rol === "Administrador" ? "dark" : "white"}
                      >
                        {u.rol}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg="success">{u.estado}</Badge>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-1">
                        {/* EDITAR */}
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => {
                            setUsuarioAEditar(u);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          title="Modificar usuario"
                        >
                          ✏️
                        </Button>

                        {/* DAR DE BAJA */}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => eliminarUsuario(u.id, u.nombre)}
                          title="Dar de baja"
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default AdminUsuarios;