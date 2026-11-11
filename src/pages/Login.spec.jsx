// src/pages/Login.spec.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

function renderConRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Pruebas Unitarias - Componente Login", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza los campos de entrada de correo y contraseña", () => {
    renderConRouter(<Login />);

    expect(screen.getByPlaceholderText(/admin@duoc\.cl/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/entre 4 y 10 caracteres/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  it("actualiza el valor escrito en el formulario", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Login />);

    const inputCorreo = screen.getByPlaceholderText(/admin@duoc\.cl/i);
    const inputPass = screen.getByPlaceholderText(/entre 4 y 10 caracteres/i);

    await usuario.type(inputCorreo, "admin@duoc.cl");
    await usuario.type(inputPass, "12345");

    expect(inputCorreo).toHaveValue("admin@duoc.cl");
    expect(inputPass).toHaveValue("12345");
  });

  it("muestra alerta de error si la contraseña tiene menos de 4 caracteres", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Login />);

    await usuario.type(screen.getByPlaceholderText(/admin@duoc\.cl/i), "usuario@gmail.com");
    await usuario.type(screen.getByPlaceholderText(/entre 4 y 10 caracteres/i), "12");

    await usuario.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(window.alert).toHaveBeenCalledWith("La contraseña debe tener entre 4 y 10 caracteres.");
  });

  it("guarda la sesión con rol 'Administrador' al autenticar con admin@duoc.cl", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Login />);

    await usuario.type(screen.getByPlaceholderText(/admin@duoc\.cl/i), "admin@duoc.cl");
    await usuario.type(screen.getByPlaceholderText(/entre 4 y 10 caracteres/i), "12345");

    await usuario.click(screen.getByRole("button", { name: /ingresar/i }));

    const sesion = JSON.parse(localStorage.getItem("usuario_sesion"));
    expect(sesion.rol).toBe("Administrador");
    expect(sesion.correo).toBe("admin@duoc.cl");
  });

  it("guarda la sesión con rol 'Cliente' cuando es un usuario general", async () => {
    const usuario = userEvent.setup();
    renderConRouter(<Login />);

    await usuario.type(screen.getByPlaceholderText(/admin@duoc\.cl/i), "comprador@gmail.com");
    await usuario.type(screen.getByPlaceholderText(/entre 4 y 10 caracteres/i), "claveSegura");

    await usuario.click(screen.getByRole("button", { name: /ingresar/i }));

    const sesion = JSON.parse(localStorage.getItem("usuario_sesion"));
    expect(sesion.rol).toBe("Cliente");
  });
});