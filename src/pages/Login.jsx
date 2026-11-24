// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { iniciarSesion } from "../services/authService";
import { useSesion } from "../components/SesionProvider";

const inicioPorRol = { ADMIN: "/admin", VENDEDOR: "/vendedor/productos", CLIENTE: "/" };

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const { activarSesion } = useSesion();
  const navigate = useNavigate();

  async function manejarLogin(e) {
    e.preventDefault();
    if (enviando) return;

    setError("");
    setEnviando(true);
    try {
      const respuesta = await iniciarSesion({ correo: correo.trim().toLowerCase(), password });
      const usuario = activarSesion(respuesta);
      navigate(inicioPorRol[usuario.rol], { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: "450px" }}>
      <div className="card p-4 shadow-sm border-0">
        <h1 className="h3 text-center mb-3 fw-bold">Iniciar Sesión</h1>
        <form onSubmit={manejarLogin}>
          {error && <p className="alert alert-danger" role="alert">{error}</p>}
          <div className="mb-3">
            <label htmlFor="loginCorreo" className="form-label">Correo electrónico</label>
            <input
              id="loginCorreo"
              type="email"
              autoComplete="username"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="nombre@ejemplo.cl"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label">Contraseña</label>
            <input
              id="loginPassword"
              type="password"
              autoComplete="current-password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={enviando}>
            {enviando ? "Ingresando…" : "Ingresar"}
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
