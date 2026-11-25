// src/pages/Registro.jsx
import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { guardarSesion } from "../utils/persistencia";

function Registro() {
  const [datos, setDatos] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: ""
  });

  function manejarRegistro(e) {
    e.preventDefault();

    // 1. Objeto con rol explícito de Cliente y nombre concatenado
    const nuevoCliente = {
      nombre: `${datos.nombre} ${datos.apellido}`.trim(),
      correo: datos.correo.trim().toLowerCase(),
      rol: "Cliente", // ASIGNACIÓN OBLIGATORIA DEL ROL CLIENTE
      estado: "Activo"
    };

    // 2. Guardar sesión usando la función centralizada de persistencia
    guardarSesion(nuevoCliente);

    // 3. Registrar también en la lista general de usuarios del sistema
    const guardados = localStorage.getItem("usuarios_sistema");
    const listaUsuarios = guardados ? JSON.parse(guardados) : [];
    localStorage.setItem(
      "usuarios_sistema",
      JSON.stringify([...listaUsuarios, { id: Date.now(), ...nuevoCliente }])
    );

    alert("Cuenta creada con éxito. Bienvenido a Los Maestros.");

    // 4. Redirección con recarga limpia para actualizar la barra de navegación
    window.location.href = "/";
  }

  return (
    <main className="container py-5" style={{ maxWidth: "500px" }}>
      <Card className="p-4 shadow-sm border-0">
        <h1 className="h3 text-center mb-3 fw-bold">Crear Cuenta</h1>
        <p className="text-center text-muted small mb-4">
          Registro exclusivo para clientes particulares y contratistas.
        </p>

        <Form onSubmit={manejarRegistro}>
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
              minLength={4}
              maxLength={10}
              required
              value={datos.password}
              onChange={(e) => setDatos({ ...datos, password: e.target.value })}
            />
          </Form.Group>

          <Button variant="warning" type="submit" className="w-100 fw-bold">
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