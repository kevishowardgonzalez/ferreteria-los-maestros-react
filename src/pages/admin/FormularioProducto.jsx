// src/pages/admin/FormularioProducto.jsx
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const inicial = { nombre: "", categoria: "", precio: "", stock: "" };

function FormularioProducto({ onGuardar }) {
  const [datos, setDatos] = useState(inicial);
  const [errores, setErrores] = useState({});

  function cambiar(evento) {
    const { name, value } = evento.target;
    setDatos({ ...datos, [name]: value });
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = {};

    if (!datos.nombre.trim()) nuevosErrores.nombre = "Nombre obligatorio";
    if (!datos.categoria) nuevosErrores.categoria = "Selecciona categoría";
    if (Number(datos.precio) <= 0) nuevosErrores.precio = "Precio debe ser mayor a 0";
    if (Number(datos.stock) < 0) nuevosErrores.stock = "El stock no puede ser negativo";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({
      ...datos,
      id: Date.now(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      descripcion: "Ingresado desde panel de administración"
    });
    setDatos(inicial);
  }

  return (
    <Form onSubmit={enviar} noValidate>
      <Form.Group className="mb-3" controlId="formNombre">
        <Form.Label>Nombre del producto</Form.Label>
        <Form.Control
          name="nombre"
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
          <option value="Herramientas Eléctricas">Herramientas Eléctricas</option>
          <option value="Construcción">Construcción</option>
          <option value="Herramientas Manuales">Herramientas Manuales</option>
          <option value="Gasfitería">Gasfitería</option>
          <option value="Pinturas">Pinturas</option>
          <option value="Electricidad">Electricidad</option>
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

      <Form.Group className="mb-3" controlId="formStock">
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
      </Form.Group>

      <Button type="submit" variant="warning" className="fw-bold">
        Guardar Producto
      </Button>
    </Form>
  );
}

export default FormularioProducto;