// src/pages/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  function manejarLogin(e) {
    e.preventDefault();
    const mail = correo.trim().toLowerCase();

    if (password.length < 4 || password.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres.");
      return;
    }

    // 1. Rol ADMINISTRADOR -> Va a /admin
    if (mail === "admin@duoc.cl" || mail.includes("admin")) {
      const sesion = { correo: mail, nombre: "Kevis Admin", rol: "Administrador" };
      localStorage.setItem("usuario_sesion", JSON.stringify(sesion));
      alert("Bienvenido Administrador");
      window.location.href = "/admin";
    } 
    // 2. Rol VENDEDOR -> Va a /vendedor/productos
    else if (mail === "vendedor@duoc.cl" || mail.includes("vendedor") || mail.includes("javier")) {
      const sesion = { correo: mail, nombre: "Javier Cruz", rol: "Vendedor" };
      localStorage.setItem("usuario_sesion", JSON.stringify(sesion));
      alert("Bienvenido Vendedor");
      window.location.href = "/vendedor/productos";
    } 
    // 3. Rol CLIENTE -> Va a la tienda pública
    else {
      const sesion = { correo: mail, nombre: "Carlos Cliente", rol: "Cliente" };
      localStorage.setItem("usuario_sesion", JSON.stringify(sesion));
      alert("Bienvenido a Ferretería Los Maestros");
      window.location.href = "/";
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: "450px" }}>
      <div className="card p-4 shadow-sm border-0">
        <h1 className="h3 text-center mb-3 fw-bold">Iniciar Sesión</h1>
        <form onSubmit={manejarLogin}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="admin@duoc.cl, vendedor@duoc.cl o usuario@gmail.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entre 4 y 10 caracteres"
              minLength={4}
              maxLength={10}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100 fw-bold">
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