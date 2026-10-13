// src/pages/Contacto.jsx
import { Container, Form, Button } from "react-bootstrap";

function Contacto() {
  function manejarEnvio(e) {
    e.preventDefault();
    alert("Mensaje enviado exitosamente. Nos contactaremos a la brevedad.");
  }

  return (
    <main className="container py-4" style={{ maxWidth: "600px" }}>
      <h1 className="h2 mb-2 fw-bold text-dark">Contacto</h1>
      <p className="text-secondary mb-4">
        ¿Tienes dudas con un pedido o requieres una cotización especial? Escríbenos.
      </p>

      <Form onSubmit={manejarEnvio} className="card p-4 shadow-sm border border-secondary border-opacity-25 bg-white">
        {/* Nombre completo */}
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label className="fw-bold text-dark mb-1">
            Nombre completo <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Ej: Juan Pérez"
            className="text-dark border-secondary"
            required
          />
        </Form.Group>

        {/* Correo electrónico */}
        <Form.Group className="mb-3" controlId="correo">
          <Form.Label className="fw-bold text-dark mb-1">
            Correo electrónico <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="usuario@gmail.com o usuario@duoc.cl"
            className="text-dark border-secondary"
            required
          />
        </Form.Group>

        {/* Mensaje o consulta */}
        <Form.Group className="mb-4" controlId="mensaje">
          <Form.Label className="fw-bold text-dark mb-1">
            Mensaje o consulta <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Escribe tu mensaje aquí..."
            className="text-dark border-secondary"
            required
          />
        </Form.Group>

        <Button type="submit" variant="warning" className="w-100 fw-bold py-2 text-dark">
          Enviar Mensaje
        </Button>
      </Form>
    </main>
  );
}

export default Contacto;