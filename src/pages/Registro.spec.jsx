// src/pages/Registro.spec.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Registro from "./Registro";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
}));

describe("Registro", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza todos los campos requeridos para el alta de usuario", () => {
    render(<Registro />);

    expect(screen.getByLabelText(/^nombre$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^apellido$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
  });

  it("permite escribir en los campos del formulario", async () => {
    const usuario = userEvent.setup();
    render(<Registro />);

    const inputNombre = screen.getByLabelText(/^nombre$/i);
    const inputPass = screen.getByLabelText(/contraseña/i);

    await usuario.type(inputNombre, "Juan");
    await usuario.type(inputPass, "clave123");

    expect(inputNombre).toHaveValue("Juan");
    expect(inputPass).toHaveValue("clave123");
  });

  it("registra exitosamente un usuario nuevo cuando no hay usuarios previos en el sistema", async () => {
    const usuario = userEvent.setup();
    render(<Registro />);

    await usuario.type(screen.getByLabelText(/^nombre$/i), "Yerickson");
    await usuario.type(screen.getByLabelText(/^apellido$/i), "Rodríguez");
    await usuario.type(screen.getByLabelText(/correo electrónico/i), "yerickson@gmail.com");
    await usuario.type(screen.getByLabelText(/contraseña/i), "clave123");

    await usuario.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(window.alert).toHaveBeenCalledWith("Cuenta creada con éxito. Bienvenido a Los Maestros.");
    const sesion = JSON.parse(localStorage.getItem("usuario_sesion"));
    expect(sesion.nombre).toContain("Yerickson");

    const lista = JSON.parse(localStorage.getItem("usuarios_sistema"));
    expect(lista).toHaveLength(1);
  });

  it("agrega el nuevo usuario a la lista existente si ya habían usuarios registrados (Cubre línea 31 rama true)", async () => {
    const usuario = userEvent.setup();

    // Precargar un usuario existente para forzar que 'guardados' sea truthy
    const usuariosPrevios = [{ id: 1, nombre: "Admin Maestro", correo: "admin@duoc.cl" }];
    localStorage.setItem("usuarios_sistema", JSON.stringify(usuariosPrevios));

    render(<Registro />);

    await usuario.type(screen.getByLabelText(/^nombre$/i), "Carlos");
    await usuario.type(screen.getByLabelText(/^apellido$/i), "Gómez");
    await usuario.type(screen.getByLabelText(/correo electrónico/i), "carlos@gmail.com");
    await usuario.type(screen.getByLabelText(/contraseña/i), "clave456");

    await usuario.click(screen.getByRole("button", { name: /registrarse/i }));

    const listaActualizada = JSON.parse(localStorage.getItem("usuarios_sistema"));
    expect(listaActualizada).toHaveLength(2);
    expect(listaActualizada[1].nombre).toContain("Carlos");
  });
});