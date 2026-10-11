// src/pages/Registro.jsx
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function Registro() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: ""
  });

  function manejarRegistro(e) {
    e.preventDefault();
    localStorage.setItem("usuario_sesion", JSON.stringify(datos));
    alert("Cuenta creada con éxito.");
    navigate("/");
  }

  return (
    <main className="container py-5" style={{ maxWidth: "500px" }}>
      <Card className="p-4 shadow-sm border-0">
        <h1 className="h3 text-center mb-3 fw-bold">Crear Cuenta</h1>
        <Form onSubmit={manejarRegistro}>
          <Form.Group className="mb-3" controlId="regNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="regApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="regCorreo">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              placeholder="nombre@duoc.cl o @gmail.com"
              required
              onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="regPass">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              minLength={4}
              maxLength={10}
              required
              onChange={(e) => setDatos({ ...datos, password: e.target.value })}
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100 fw-bold">
            Registrarse
          </Button>
        </Form>
        <p className="text-center small mt-3 mb-0">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </Card>
    </main>
  );
}

export default Registro;