import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import SesionProvider from "../components/SesionProvider";
import { authDePrueba } from "../test/sesion";

const navegar = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navegar,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

function renderLogin() {
  render(<SesionProvider><Login /></SesionProvider>);
}

async function enviarLogin() {
  const usuario = userEvent.setup();
  await usuario.type(screen.getByLabelText(/correo/i), "Cuenta@ejemplo.cl");
  await usuario.type(screen.getByLabelText(/contraseña/i), "dato-de-prueba");
  await usuario.click(screen.getByRole("button", { name: "Ingresar" }));
}

describe("Login", () => {
  beforeEach(() => {
    navegar.mockClear();
    sessionStorage.clear();
    localStorage.clear();
    vi.stubEnv("VITE_AUTH_API_URL", "http://localhost:8081/api");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("renderiza campos accesibles de correo y contraseña", () => {
    renderLogin();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute("type", "password");
  });

  it.each([
    ["ADMIN", "/admin"],
    ["VENDEDOR", "/vendedor/productos"],
    ["CLIENTE", "/"],
  ])("redirige a %s según el rol devuelto por Auth", async (rol, ruta) => {
    const datos = authDePrueba(rol);
    const fetchAuth = vi.fn().mockResolvedValue(Response.json(datos));
    vi.stubGlobal("fetch", fetchAuth);
    renderLogin();
    await enviarLogin();

    expect(fetchAuth).toHaveBeenCalledWith("http://localhost:8081/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: "cuenta@ejemplo.cl", password: "dato-de-prueba" }),
    });
    expect(navegar).toHaveBeenCalledWith(ruta, { replace: true });
    const { token, ...usuario } = datos;
    expect(JSON.parse(sessionStorage.getItem("usuario_sesion"))).toEqual({ token, usuario });
    expect(localStorage.getItem("usuario_sesion")).toBeNull();
  });

  it("muestra el rechazo de credenciales sin crear sesión ni navegar", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(
      { mensaje: "Credenciales inválidas" }, { status: 401 },
    )));
    renderLogin();
    await enviarLogin();

    expect(await screen.findByRole("alert")).toHaveTextContent("Credenciales inválidas");
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
    expect(navegar).not.toHaveBeenCalled();
  });

  it("muestra un error cuando el servicio no está disponible", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    renderLogin();
    await enviarLogin();

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar");
  });
});
