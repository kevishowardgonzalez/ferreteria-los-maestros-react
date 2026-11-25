// src/pages/admin/FormularioProducto.jsx
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const inicial = { nombre: "", categoria: "", precio: "", stock: "", descripcion: "" };

function FormularioProducto({ onGuardar, productoAEditar, onCancelarEdicion, categorias, ocupado }) {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});

  // Carga los datos en el formulario si se presiona "Editar"
  useEffect(() => {
    if (productoAEditar) {
      setDatos({ ...productoAEditar, descripcion: productoAEditar.descripcion ?? "" });
    } else {
      setDatos(inicial);
    }
  }, [productoAEditar]);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = {};

    if (!datos.nombre.trim()) nuevosErrores.nombre = "Nombre obligatorio";
    if (!datos.categoria) nuevosErrores.categoria = "Selecciona categoría";
    if (datos.precio === "" || !Number.isFinite(Number(datos.precio)) || Number(datos.precio) < 0) nuevosErrores.precio = "Ingresa un precio no negativo";
    if (!productoAEditar && (datos.stock === "" || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0 || Number(datos.stock) > 2147483647)) nuevosErrores.stock = "Ingresa un stock entero no negativo";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const guardado = await onGuardar({
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      precio: Number(datos.precio),
      stock: productoAEditar ? productoAEditar.stock : Number(datos.stock),
      descripcion: datos.descripcion.trim(),
    });

    if (guardado) setDatos(inicial);
  }

  return (
    <Form onSubmit={enviar} noValidate>
      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Label>Nombre del producto</Form.Label>
        <Form.Control
          name="nombre"
          maxLength={100}
          value={datos.nombre}
          onChange={cambiar}
          isInvalid={Boolean(errores.nombre)}
          placeholder="Ej: Taladro Percutor 20V"
        />
        <Form.Control.Feedback type="invalid">
          {errores.nombre}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCategoria">
        <Form.Label>Categoría</Form.Label>
        <Form.Select
          name="categoria"
          value={datos.categoria}
          onChange={cambiar}
          isInvalid={Boolean(errores.categoria)}
        >
          <option value="">Selecciona categoría</option>
          {productoAEditar?.categoria && !categorias.some(({ nombre }) => nombre === productoAEditar.categoria) && (
            <option value={productoAEditar.categoria}>{productoAEditar.categoria}</option>
          )}
          {categorias.map(({ id, nombre }) => <option key={id} value={nombre}>{nombre}</option>)}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errores.categoria}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPrecio">
        <Form.Label>Precio ($ CLP)</Form.Label>
        <Form.Control
          type="number"
          name="precio"
          step="0.01"
          min="0"
          value={datos.precio}
          onChange={cambiar}
          isInvalid={Boolean(errores.precio)}
          placeholder="Ej: 59990"
        />
        <Form.Control.Feedback type="invalid">
          {errores.precio}
        </Form.Control.Feedback>
      </Form.Group>

      {!productoAEditar && <Form.Group className="mb-3" controlId="formStock">
        <Form.Label>Stock inicial</Form.Label>
        <Form.Control
          type="number"
          name="stock"
          min="0"
          value={datos.stock}
          onChange={cambiar}
          isInvalid={Boolean(errores.stock)}
          placeholder="Ej: 15"
        />
        <Form.Control.Feedback type="invalid">
          {errores.stock}
        </Form.Control.Feedback>
      </Form.Group>}

      <Form.Group className="mb-3" controlId="formDescripcion">
        <Form.Label>Descripción</Form.Label>
        <Form.Control as="textarea" name="descripcion" maxLength={1000} value={datos.descripcion} onChange={cambiar} />
      </Form.Group>
      <div className="d-flex gap-2">
        <Button disabled={ocupado} type="submit" variant="warning" className="fw-bold">
          {productoAEditar ? "Actualizar Producto" : "Guardar Producto"}
        </Button>
        {productoAEditar && (
          <Button disabled={ocupado} type="button" variant="secondary" onClick={onCancelarEdicion}>
            Cancelar
          </Button>
        )}
      </div>
    </Form>
  );
}

export default FormularioProducto;
