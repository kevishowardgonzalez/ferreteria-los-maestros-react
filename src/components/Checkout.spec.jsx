// src/components/Checkout.spec.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkout from "./Checkout";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to, className }) => <a href={to} className={className}>{children}</a>,
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
    render(<Checkout carrito={[]} onCompraExitosa={() => { }} />);
    expect(screen.getByText("No tienes productos en el carrito.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /volver al catálogo/i })).toBeInTheDocument();
  });

  it("muestra resumen de ítems y total a pagar", () => {
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => { }} />);
    expect(screen.getByText(/Taladro x 1/)).toBeInTheDocument();
    expect(screen.getByText(/Total: \$50\.000/)).toBeInTheDocument();
  });

  it("carga automáticamente los datos del usuario si hay sesión guardada en localStorage", () => {
    localStorage.setItem("usuario_sesion", JSON.stringify({ nombre: "Carlos", correo: "carlos@duoc.cl" }));
    render(<Checkout carrito={carritoMock} />);
    expect(screen.getByLabelText("Nombre")).toHaveValue("Carlos");
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue("carlos@duoc.cl");
  });

  it("valida campos requeridos obligatorios (nombre, apellido y correo)", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => { }} />);

    const inputNombre = screen.getByLabelText("Nombre");
    await usuario.clear(inputNombre);
    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
    expect(screen.getByText("El apellido es obligatorio")).toBeInTheDocument();
  });

  it("valida formato de correo electrónico exigiendo arroba y punto", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => { }} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Kevis");
    await usuario.type(screen.getByLabelText("Apellido"), "González");
    const inputCorreo = screen.getByLabelText("Correo electrónico");
    await usuario.clear(inputCorreo);
    await usuario.type(inputCorreo, "correo-invalido");

    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));
    expect(screen.getByText("Ingresa un correo válido")).toBeInTheDocument();
  });

  it("exige los datos de dirección si la entrega es a domicilio y los campos están vacíos (Línea 47)", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => { }} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Kevis");
    await usuario.type(screen.getByLabelText("Apellido"), "González");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "kevis@duoc.cl");

    // Vaciar los campos precargados de domicilio
    await usuario.clear(screen.getByLabelText("Calle"));
    await usuario.clear(screen.getByLabelText("Número"));
    await usuario.clear(screen.getByLabelText("Región"));
    await usuario.clear(screen.getByLabelText("Comuna"));

    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(screen.getByText("La calle es obligatoria")).toBeInTheDocument();
    expect(screen.getByText("Ingresa el número")).toBeInTheDocument();
    expect(screen.getByText("Ingresa la región")).toBeInTheDocument();
    expect(screen.getByText("Ingresa la comuna")).toBeInTheDocument();
  });

  it("permite escribir en el campo de indicaciones adicionales y procesar con dirección válida (Cubre branch false de línea 47)", async () => {
    const usuario = userEvent.setup();
    const mockExitosa = vi.fn();
    render(<Checkout carrito={carritoMock} onCompraExitosa={mockExitosa} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Carlos");
    await usuario.type(screen.getByLabelText("Apellido"), "López");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "carlos@duoc.cl");

    // Mantener o rellenar dirección válida
    const textarea = screen.getByLabelText(/indicaciones adicionales/i);
    await usuario.type(textarea, "Dejar en conserjería");

    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(mockExitosa).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/compra-exitosa", expect.any(Object));
  });

  it("oculta campos de dirección y procesa la compra si se selecciona 'Retiro en tienda'", async () => {
    const usuario = userEvent.setup();
    const mockExitosa = vi.fn();
    render(<Checkout carrito={carritoMock} onCompraExitosa={mockExitosa} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Pedro");
    await usuario.type(screen.getByLabelText("Apellido"), "Soto");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "pedro@duoc.cl");
    await usuario.selectOptions(screen.getByLabelText("Seleccionar entrega"), "retiro");

    expect(screen.queryByLabelText("Calle")).not.toBeInTheDocument();

    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));
    expect(mockExitosa).toHaveBeenCalledTimes(1);
  });

  it("completa compra exitosa incluso si no se pasa la función prop onCompraExitosa", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Ana");
    await usuario.type(screen.getByLabelText("Apellido"), "Díaz");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "ana@duoc.cl");
    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/compra-exitosa", expect.any(Object));
  });

  it("redirige a /compra-fallida si se simula un pago rechazado", async () => {
    const usuario = userEvent.setup();
    render(<Checkout carrito={carritoMock} onCompraExitosa={() => { }} />);

    await usuario.type(screen.getByLabelText("Nombre"), "Juan");
    await usuario.type(screen.getByLabelText("Apellido"), "Pérez");
    await usuario.type(screen.getByLabelText("Correo electrónico"), "juan@gmail.com");
    await usuario.selectOptions(screen.getByLabelText("Resultado del pago"), "rechazado");
    await usuario.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/compra-fallida");
  });
});