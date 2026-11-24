import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Registro from "./Registro";
import SesionProvider from "../components/SesionProvider";
import { authDePrueba } from "../test/sesion";

const navegar = vi.fn();
vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => navegar,
}));

const datos = { run: "11111111-1", nombre: "Usuario", apellido: "Prueba", correo: "cuenta@ejemplo.cl", password: "prueba123" };

function renderRegistro() {
  render(<SesionProvider><Registro /></SesionProvider>);
}

async function enviarRegistro() {
  const usuario = userEvent.setup();
  for (const [campo, valor] of [
    [/^run$/i, datos.run],
    [/^nombre$/i, datos.nombre],
    [/^apellido$/i, datos.apellido],
    [/correo/i, datos.correo],
    [/contraseña/i, datos.password],
  ]) {
    await usuario.type(screen.getByLabelText(campo), valor);
  }
  await usuario.click(screen.getByRole("button", { name: "Registrarse" }));
}

describe("Registro", () => {
  beforeEach(() => {
    navegar.mockClear();
    localStorage.clear();
    sessionStorage.clear();
    vi.stubEnv("VITE_AUTH_API_URL", "http://localhost:8081/api");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("pide RUN y aplica los límites de contraseña del DTO", () => {
    renderRegistro();
    expect(screen.getByLabelText("RUN")).toBeRequired();
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute("minlength", "4");
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute("maxlength", "10");
  });

  it("envía el DTO sin rol y abre la sesión de cliente que devuelve Auth", async () => {
    const fetchAuth = vi.fn().mockResolvedValue(Response.json(authDePrueba(), { status: 201 }));
    vi.stubGlobal("fetch", fetchAuth);
    renderRegistro();
    await enviarRegistro();

    expect(fetchAuth).toHaveBeenCalledWith("http://localhost:8081/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    expect(JSON.parse(sessionStorage.getItem("usuario_sesion")).usuario.rol).toBe("CLIENTE");
    expect(localStorage.getItem("usuarios_sistema")).toBeNull();
    expect(navegar).toHaveBeenCalledWith("/", { replace: true });
  });

  it("muestra el rechazo del backend y conserva el formulario", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(
      { mensaje: "El correo ya existe" }, { status: 400 },
    )));
    renderRegistro();
    await enviarRegistro();

    expect(await screen.findByRole("alert")).toHaveTextContent("El correo ya existe");
    expect(screen.getByLabelText("RUN")).toHaveValue(datos.run);
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
    expect(navegar).not.toHaveBeenCalled();
  });
});
