// src/pages/Registro.spec.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Registro from "./Registro";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Registro", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
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

  it("registra exitosamente un usuario nuevo mostrando el mensaje de bienvenida", async () => {
    const usuario = userEvent.setup();
    render(<Registro />);

    await usuario.type(screen.getByLabelText(/^nombre$/i), "Yerickson");
    await usuario.type(screen.getByLabelText(/^apellido$/i), "Rodríguez");
    await usuario.type(screen.getByLabelText(/correo electrónico/i), "yerickson@gmail.com");
    await usuario.type(screen.getByLabelText(/contraseña/i), "clave123");

    await usuario.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(window.alert).toHaveBeenCalledWith("Cuenta creada con éxito. Bienvenido a Los Maestros.");
  });
});