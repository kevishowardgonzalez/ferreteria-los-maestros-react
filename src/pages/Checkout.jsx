
import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";

function Checkout({ carrito, onCompraExitosa }) {

  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    calle: "",
    numero: "",
    region: "",
    comuna: "",
    indicaciones: "",
    entrega: "domicilio",
    pago: "aprobado"
  });

  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState(null);

  let total = 0;

  carrito.forEach((producto) => {
    total += producto.precio * producto.cantidad;
  });

  function cambiar(evento) {
    const { name, value } = evento.target;

    setDatos({
      ...datos,
      [name]: value
    });
  }

  function enviar(evento) {
    evento.preventDefault();

    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!datos.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    }

    if (!datos.correo.includes("@") ||
        !datos.correo.includes(".")) {
      nuevosErrores.correo = "Ingresa un correo válido";
    }

    if (datos.entrega === "domicilio") {
      if (!datos.calle.trim()) {
        nuevosErrores.calle = "La calle es obligatoria";
      }

      if (!datos.numero.trim()) {
        nuevosErrores.numero = "Ingresa el número";
      }

      if (!datos.region.trim()) {
        nuevosErrores.region = "Ingresa la región";
      }

      if (!datos.comuna.trim()) {
        nuevosErrores.comuna = "Ingresa la comuna";
      }
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const compraExitosa = datos.pago === "aprobado";

    setResultado({
      exitosa: compraExitosa,
      cliente: { ...datos },
      productos: carrito.map((producto) => ({ ...producto })),
      total: total
    });

    if (compraExitosa) {
      onCompraExitosa();
    }
  }

  // Vista de compra exitosa o rechazada
  if (resultado !== null) {
    return (
      <main className="container py-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">

            <h1 className={
              resultado.exitosa
                ? "h2 text-success"
                : "h2 text-danger"
            }>
              {resultado.exitosa
                ? "Compra simulada exitosa"
                : "Pago simulado rechazado"}
            </h1>

            <p>
              Cliente: {resultado.cliente.nombre}
              {" "}{resultado.cliente.apellido}
            </p>

            <p>
              Correo: {resultado.cliente.correo}
            </p>

            <h2 className="h4">Resumen del pedido</h2>

            {resultado.productos.map((producto) => (
              <p key={producto.id}>
                {producto.nombre} x {producto.cantidad}
                {" - $"}
                {(producto.precio * producto.cantidad)
                  .toLocaleString("es-CL")}
              </p>
            ))}

            <h3 className="h4">
              Total: ${resultado.total.toLocaleString("es-CL")}
            </h3>

            <p className="text-muted">
              Esta operación es una simulación académica.
              No se realizaron cobros reales.
            </p>

            {resultado.exitosa ? (
              <Link to="/" className="btn btn-success">
                Volver a la tienda
              </Link>
            ) : (
              <Button
                onClick={() => setResultado(null)}
              >
                Volver a intentar
              </Button>
            )}

          </div>
        </div>
      </main>
    );
  }

  // Verificar que existan productos
  if (carrito.length === 0) {
    return (
      <main className="container py-5">
        <h1 className="h2">Finalizar compra</h1>
        <p>No tienes productos en el carrito.</p>

        <Link to="/" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-5">

      <h1 className="h2 mb-4">Finalizar compra</h1>

      <p className="alert alert-info">
        Proyecto académico: el pago será simulado.
      </p>

      <Row className="g-4">
        <Col xs={12} lg={7}>

          <Form onSubmit={enviar} noValidate>

            <h2 className="h4 mb-3">
              Información del cliente
            </h2>

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
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

            <Form.Group className="mb-3" controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                name="apellido"
                value={datos.apellido}
                onChange={cambiar}
                isInvalid={Boolean(errores.apellido)}
              />
              <Form.Control.Feedback type="invalid">
                {errores.apellido}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="correo">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={datos.correo}
                onChange={cambiar}
                isInvalid={Boolean(errores.correo)}
              />
              <Form.Control.Feedback type="invalid">
                {errores.correo}
              </Form.Control.Feedback>
            </Form.Group>

            <h2 className="h4 mt-4">
              Método de entrega
            </h2>

            <Form.Group className="mb-3" controlId="entrega">
              <Form.Label>Seleccionar entrega</Form.Label>
              <Form.Select
                name="entrega"
                value={datos.entrega}
                onChange={cambiar}
              >
                <option value="domicilio">
                  Despacho a domicilio
                </option>
                <option value="retiro">
                  Retiro en tienda
                </option>
              </Form.Select>
            </Form.Group>

            {datos.entrega === "domicilio" && (
              <>
                <h2 className="h4 mt-4">
                  Dirección de entrega
                </h2>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3" controlId="calle">
                      <Form.Label>Calle</Form.Label>
                      <Form.Control
                        name="calle"
                        value={datos.calle}
                        onChange={cambiar}
                        isInvalid={Boolean(errores.calle)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.calle}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="numero">
                      <Form.Label>Número</Form.Label>
                      <Form.Control
                        name="numero"
                        value={datos.numero}
                        onChange={cambiar}
                        isInvalid={Boolean(errores.numero)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.numero}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="region">
                  <Form.Label>Región</Form.Label>
                  <Form.Control
                    name="region"
                    value={datos.region}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.region)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.region}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="comuna">
                  <Form.Label>Comuna</Form.Label>
                  <Form.Control
                    name="comuna"
                    value={datos.comuna}
                    onChange={cambiar}
                    isInvalid={Boolean(errores.comuna)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.comuna}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="indicaciones">
                  <Form.Label>
                    Indicaciones adicionales (opcional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="indicaciones"
                    value={datos.indicaciones}
                    onChange={cambiar}
                  />
                </Form.Group>
              </>
            )}

            <h2 className="h4 mt-4">
              Simulación de pago
            </h2>

            <Form.Group className="mb-3" controlId="pago">
              <Form.Label>Resultado del pago</Form.Label>
              <Form.Select
                name="pago"
                value={datos.pago}
                onChange={cambiar}
              >
                <option value="aprobado">
                  Simular pago aprobado
                </option>
                <option value="rechazado">
                  Simular pago rechazado
                </option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="success">
              Finalizar compra
            </Button>

          </Form>
        </Col>

        <Col xs={12} lg={5}>
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4">Resumen del carrito</h2>

              {carrito.map((producto) => (
                <p key={producto.id}>
                  {producto.nombre} x {producto.cantidad}
                  {" - $"}
                  {(producto.precio * producto.cantidad)
                    .toLocaleString("es-CL")}
                </p>
              ))}

              <hr />

              <h3 className="h4">
                Total: ${total.toLocaleString("es-CL")}
              </h3>

              <Link to="/carrito">
                Volver al carrito
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </main>
  );
}

export default Checkout;
