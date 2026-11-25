import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import MenuAdmin from "./MenuAdmin";
import { actualizarCategoria, crearCategoria, desactivarCategoria, listarCategorias } from "../../services/categorias";
import { obtenerSesion } from "../../utils/persistencia";

const inicial = { nombre: "", descripcion: "", activo: true };

export default function AdminCategorias({ token, alCambiar }) {
  const [categorias, setCategorias] = useState([]);
  const [datos, setDatos] = useState(inicial);
  const [id, setId] = useState(null);
  const [revision, setRevision] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [errorCarga, setErrorCarga] = useState("");
  const usuario = obtenerSesion();
  const puedeEditar = ["ADMIN", "Administrador"].includes(usuario?.rol);
  const credencial = token ?? usuario?.token;

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setErrorCarga("");
    listarCategorias(credencial)
      .then((lista) => { if (vigente) setCategorias(lista); })
      .catch((error) => { if (vigente) setErrorCarga(error.message); })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [revision, credencial]);

  function limpiarFormulario() {
    setId(null);
    setDatos(inicial);
  }

  async function ejecutar(operacion, exito) {
    if (!puedeEditar || ocupado) return false;
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      await operacion();
      setRevision((actual) => actual + 1);
      alCambiar?.();
      setMensaje(exito);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setOcupado(false);
    }
  }

  async function guardar(evento) {
    evento.preventDefault();
    const nombre = datos.nombre.trim();
    if (!nombre) {
      setError("El nombre es obligatorio.");
      return;
    }
    const solicitud = { ...datos, nombre, descripcion: datos.descripcion.trim() };
    const listo = await ejecutar(
      () => id === null ? crearCategoria(solicitud, credencial) : actualizarCategoria(id, solicitud, credencial),
      id === null ? "Categoría creada." : "Categoría actualizada.",
    );
    if (listo) limpiarFormulario();
  }

  async function desactivar(categoria) {
    if (!window.confirm(`¿Deseas desactivar "${categoria.nombre}"?`)) return;
    const listo = await ejecutar(() => desactivarCategoria(categoria.id, credencial), "Categoría desactivada.");
    if (listo && id === categoria.id) limpiarFormulario();
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      <MenuAdmin />
      <main className="flex-grow-1 p-4 overflow-auto">
        <h1 className="h4 fw-bold mb-3">Gestión de Categorías</h1>
        {mensaje && <p role="status" className="alert alert-success">{mensaje}</p>}
        {(error || errorCarga) && <p role="alert" className="alert alert-danger">{error || errorCarga}</p>}

        {puedeEditar && (
          <section className="card shadow-sm border-0 p-4 mb-4 bg-white">
            <h2 className="h5 fw-bold mb-3">{id === null ? "Nueva Categoría" : "Editar Categoría"}</h2>
            <Form onSubmit={guardar}>
              <Form.Group controlId="nombreCat" className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={datos.nombre} maxLength={80} required
                  onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="descripcionCat" className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" value={datos.descripcion} maxLength={255}
                  onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })} />
              </Form.Group>
              <Form.Check id="activoCat" label="Activa" className="mb-3" checked={datos.activo}
                onChange={(e) => setDatos({ ...datos, activo: e.target.checked })} />
              <Button type="submit" variant="warning" disabled={ocupado}>Guardar</Button>
              {id !== null && <Button variant="secondary" className="ms-2" disabled={ocupado} onClick={limpiarFormulario}>Cancelar</Button>}
            </Form>
          </section>
        )}
        <section className="card shadow-sm border-0 p-3 bg-white">
          <h2 className="h5 fw-bold mb-3">Listado de Categorías</h2>
          {cargando && <p role="status">Cargando categorías...</p>}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr><th>ID</th><th>Categoría</th><th>Descripción</th><th>Estado</th>{puedeEditar && <th>Acciones</th>}</tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>#{categoria.id}</td><td>{categoria.nombre}</td><td>{categoria.descripcion}</td>
                    <td>{categoria.activo ? "Activa" : "Inactiva"}</td>
                    {puedeEditar && <td>
                      <Button variant="outline-warning" size="sm" disabled={ocupado} onClick={() => {
                        setId(categoria.id);
                        setDatos({ nombre: categoria.nombre, descripcion: categoria.descripcion ?? "", activo: Boolean(categoria.activo) });
                      }}>Editar</Button>{" "}
                      <Button variant="outline-danger" size="sm" disabled={ocupado || !categoria.activo}
                        onClick={() => desactivar(categoria)}>Desactivar</Button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {!cargando && !errorCarga && categorias.length === 0 && <p className="mt-3">No hay categorías.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
