// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { iniciarSesion } from "../services/authService";
import { useSesion } from "../hooks/useSesion";
import { destinosPorRol } from "../utils/sesion";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { activarSesion } = useSesion();
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function manejarLogin(e) {
    e.preventDefault();
    if (ocupado) return;
    const mail = correo.trim().toLowerCase();
    if (!mail || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setOcupado(true);
    setError("");
    try {
      const respuesta = await iniciarSesion({ correo: mail, password });
      const usuario = activarSesion(respuesta);
      navigate(destinosPorRol[usuario.rol], { replace: true });
    } catch (error) {
      setError(error.estado === 401 ? "Correo o contraseña incorrectos, o cuenta inactiva." : error.message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <main className="container py-5" style={{ maxWidth: "450px" }}>
      <div className="card p-4 shadow-sm border-0">
        <h1 className="h3 text-center mb-3 fw-bold">Iniciar Sesión</h1>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        <form onSubmit={manejarLogin}>
          <div className="mb-3">
            <label className="form-label" htmlFor="loginCorreo">Correo electrónico</label>
            <input
              type="email"
              id="loginCorreo"
              autoComplete="username"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="nombre@ejemplo.cl"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="loginPassword">Contraseña</label>
            <input
              type="password"
              id="loginPassword"
              autoComplete="current-password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={ocupado}>
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