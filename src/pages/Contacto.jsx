// src/pages/Contacto.jsx
import { Container, Form, Button } from "react-bootstrap";

function Contacto() {
  function manejarEnvio(e) {
    e.preventDefault();
    alert("Mensaje enviado exitosamente. Nos contactaremos a la brevedad.");
  }

  return (
    <main className="container py-4" style={{ maxWidth: "600px" }}>
      <h1 className="h2 mb-3">Contacto</h1>
      <p className="text-muted">
        ¿Tienes dudas con un pedido o requieres una cotización especial? Escríbenos.
      </p>

      <Form onSubmit={manejarEnvio} className="card p-4 shadow-sm border-0 mt-3">
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control type="text" placeholder="Ej: Juan Pérez" required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="correo">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="usuario@gmail.com o usuario@duoc.cl"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="mensaje">
          <Form.Label>Mensaje o consulta</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Escribe tu mensaje..."
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Enviar Mensaje
        </Button>
      </Form>
    </main>
  );
}

export default Contacto;