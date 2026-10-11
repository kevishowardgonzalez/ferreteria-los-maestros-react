// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function manejarLogin(e) {
    e.preventDefault();
    const valorCorreo = correo.trim().toLowerCase();

    if (valorCorreo === "admin@duoc.cl" || valorCorreo.includes("admin")) {
      const adminSesion = {
        correo: valorCorreo,
        nombre: "Administrador General",
        rol: "Administrador"
      };
      localStorage.setItem("usuario_sesion", JSON.stringify(adminSesion));
      alert("Bienvenido al panel de administración");
      navigate("/admin/productos");
      window.location.reload(); // Actualiza la barra superior
    } else {
      const clienteSesion = {
        correo: valorCorreo,
        nombre: "Cliente Maestro",
        rol: "Cliente"
      };
      localStorage.setItem("usuario_sesion", JSON.stringify(clienteSesion));
      alert("Inicio de sesión exitoso");
      navigate("/");
      window.location.reload(); // Actualiza la barra superior
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: "450px" }}>
      <div className="card p-4 shadow-sm border-0">
        <h1 className="h3 text-center mb-3 fw-bold">Iniciar Sesión</h1>

        <form onSubmit={manejarLogin}>
          <div className="mb-3">
            <label htmlFor="loginCorreo" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              id="loginCorreo"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="admin@duoc.cl o usuario@gmail.com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="loginPass" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="loginPass"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entre 4 y 10 caracteres"
              minLength={4}
              maxLength={10}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Ingresar
          </button>
        </form>

        <p className="text-center small mt-3 mb-0">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;