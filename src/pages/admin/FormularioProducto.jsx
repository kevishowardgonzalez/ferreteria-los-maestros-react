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
            precio: Number(datos.precio),
            stock: Number(datos.stock)
        });
        setDatos(inicial);
    }

    return (
        <Form onSubmit={enviar} noValidate>
            <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre del producto</Form.Label>
                <Form.Control
                    name="nombre"
                    value={datos.nombre}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.nombre)}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="categoria">
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
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errores.categoria}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="precio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                    type="number"
                    name="precio"
                    value={datos.precio}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.precio)}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.precio}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="stock">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                    type="number"
                    name="stock"
                    value={datos.stock}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.stock)}
                />
                <Form.Control.Feedback type="invalid">
                    {errores.stock}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary">Guardar Producto</Button>
        </Form>
    );
}

export default FormularioProducto;