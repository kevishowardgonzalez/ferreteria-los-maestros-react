// src/pages/Registro.jsx
import { useState } from "react";
import { Alert, Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { registrarCliente } from "../services/authService";
import { useSesion } from "../components/SesionProvider";

function Registro() {
  const [datos, setDatos] = useState({
    run: "",
    nombre: "",
    apellido: "",
    correo: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { activarSesion } = useSesion();
  const navigate = useNavigate();

  async function manejarRegistro(e) {
    e.preventDefault();
    if (enviando) return;

    setError("");
    setEnviando(true);
    try {
      const respuesta = await registrarCliente({
        run: datos.run.trim(),
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        correo: datos.correo.trim().toLowerCase(),
        password: datos.password,
      });
      activarSesion(respuesta);
      navigate("/", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: "500px" }}>
      <Card className="p-4 shadow-sm border-0">
        <h1 className="h3 text-center mb-3 fw-bold">Crear Cuenta</h1>
        <p className="text-center text-muted small mb-4">
          Registro exclusivo para clientes particulares y contratistas.
        </p>

        <Form onSubmit={manejarRegistro}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3" controlId="regRun">
            <Form.Label>RUN</Form.Label>
            <Form.Control
              type="text"
              required
              value={datos.run}
              onChange={(e) => setDatos({ ...datos, run: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="regNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              required
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="regApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              required
              value={datos.apellido}
              onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="regCorreo">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="nombre@duoc.cl o @gmail.com"
              required
              value={datos.correo}
              onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="regPass">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              autoComplete="new-password"
              minLength={4}
              maxLength={10}
              required
              value={datos.password}
              onChange={(e) => setDatos({ ...datos, password: e.target.value })}
            />
          </Form.Group>

          <Button variant="warning" type="submit" className="w-100 fw-bold" disabled={enviando}>
            {enviando ? "Registrando…" : "Registrarse"}
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
