// src/components/Checkout.spec.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkout from "./Checkout";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Checkout", () => {
  const carritoMock = [
    { id: 1, nombre: "Taladro", precio: 50000, cantidad: 1 },
  ];

  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it("muestra advertencia y botón de retorno si el carrito está vacío", () => {
    render(<Checkout carrito={[]} onCompraExitosa={() => {}} />);
    expect(screen.getByText("No tienes productos en el carrito.")).toBeInTheDocument();
  });

  it("muestra resumen de ítems y total a pagar", () => {
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => {}} />);
    expect(screen.getByText(/Taladro x 1/)).toBeInTheDocument();
    expect(screen.getByText(/Total: \$50\.000/)).toBeInTheDocument();
  });

  it("valida campos requeridos obligatorios mostrando mensajes de error", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => {}} />);

    const inputNombre = screen.getByLabelText("Nombre");
    await usuario.clear(inputNombre);
    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
  });

  it("exige que el apellido no esté vacío", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => {}} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Kevis");
    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));
    expect(screen.getByText("El apellido es obligatorio")).toBeInTheDocument();
  });

  it("rechaza formatos de correo electrónico no válidos", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => {}} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Kevis");
    await usuario.type(screen.getByLabelText("Apellido"), "González");
    const inputCorreo = screen.getByLabelText("Correo electrónico");
    await usuario.clear(inputCorreo);
    await usuario.type(inputCorreo, "correo-invalido-sin-arroba");

    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));
    expect(screen.getByText("Ingresa un correo válido")).toBeInTheDocument();
  });

  it("oculta campos de calle y número si se selecciona 'Retiro en tienda'", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => {}} />);

    await usuario.selectOptions(screen.getByLabelText("Seleccionar entrega"), "retiro");
    expect(screen.queryByLabelText("Dirección de entrega")).not.toBeInTheDocument();
  });

  it("completa compra simulada exitosa redirigiendo a /compra-exitosa", async () => {
    const usuario = userEvent.setup();
    const mockExitosa = vi.fn();
    render(<Checkout carrito={carritoMock} onCompraExitosa={mockExitosa} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Juan");
    await usuario.type(screen.getByLabelText("Apellido"), "Pérez");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "juan@gmail.com");
    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(mockExitosa).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/compra-exitosa", expect.any(Object));
  });

  it("redirige a /compra-fallida si se simula un pago rechazado", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => {}} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Juan");
    await usuario.type(screen.getByLabelText("Apellido"), "Pérez");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "juan@gmail.com");
    await usuario.selectOptions(screen.getByLabelText("Resultado del pago"), "rechazado");
    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/compra-fallida");
  });
});