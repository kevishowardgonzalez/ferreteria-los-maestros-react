// src/pages/cliente/PerfilCliente.jsx
import { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function PerfilCliente() {
  const sesion = localStorage.getItem("usuario_sesion");
  const usuario = sesion ? JSON.parse(sesion) : null;

  const [nombre, setNombre] = useState(usuario?.nombre || "Yerickson Maestro");
  const [correo] = useState(usuario?.correo || "yerickson@gmail.com");
  const [telefono, setTelefono] = useState("+56 9 8765 4321");
  const [direccion, setDireccion] = useState("Av. Balmaceda 1234, Depto 402");
  const [comuna, setComuna] = useState("La Serena");
  const [mensaje, setMensaje] = useState("");

  function guardarPerfil(e) {
    e.preventDefault();
    const actualizado = { ...usuario, nombre };
    localStorage.setItem("usuario_sesion", JSON.stringify(actualizado));
    setMensaje("Tus datos personales y de envío han sido actualizados con éxito.");
  }

  return (
    <Container className="py-4" style={{ maxWidth: "600px" }}>
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">Mi Perfil</h1>
          <p className="text-muted mb-0 small">Administra tus datos de contacto y entrega.</p>
        </div>
        <Link to="/cliente/compras" className="btn btn-outline-primary btn-sm fw-semibold">
          Ver Mis Compras
        </Link>
      </div>

      {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

      <Card className="shadow-sm border-0 p-4 bg-white">
        <Form onSubmit={guardarPerfil}>
          <Form.Group className="mb-3" controlId="perfilClienteNombre">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="perfilClienteCorreo">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control type="email" value={correo} disabled />
            <Form.Text className="text-muted">El correo de la cuenta no se puede modificar.</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="perfilClienteTelefono">
            <Form.Label>Teléfono de Contacto</Form.Label>
            <Form.Control
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="perfilClienteDireccion">
            <Form.Label>Dirección de Envío</Form.Label>
            <Form.Control
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="perfilClienteComuna">
            <Form.Label>Comuna / Región</Form.Label>
            <Form.Control
              type="text"
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="warning" className="w-100 fw-bold">
            Guardar Cambios
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default PerfilCliente;