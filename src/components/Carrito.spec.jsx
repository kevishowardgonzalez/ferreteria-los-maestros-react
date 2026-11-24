// src/components/Carrito.spec.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Carrito from "./Carrito";

vi.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Carrito", () => {
  const carritoPrueba = [
    {
      id: 1,
      nombre: "Taladro Percutor 20V",
      precio: 59990,
      cantidad: 2,
      stock: 6,
    },
  ];

  it("muestra el mensaje de carrito vacío cuando no hay ítems", () => {
    render(
      <Carrito
        carrito={[]}
        onCambiarCantidad={() => {}}
        onEliminar={() => {}}
        onVaciar={() => {}}
      />
    );

    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ver todos los productos/i })).toHaveAttribute("href", "/productos");
  });

  it("renderiza el nombre del producto y calcula el total acumulado", () => {
    render(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={() => {}}
        onEliminar={() => {}}
        onVaciar={() => {}}
      />
    );

    expect(screen.getByText("Taladro Percutor 20V")).toBeInTheDocument();
    expect(screen.getByText(/Total:\s*\$119\.980/i)).toBeInTheDocument();
  });

  it("llama a la función onCambiarCantidad incrementando al presionar el botón '+'", async () => {
    const usuario = userEvent.setup();
    const mockCambiarCantidad = vi.fn();

    render(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={mockCambiarCantidad}
        onEliminar={() => {}}
        onVaciar={() => {}}
      />
    );

    await usuario.click(screen.getByRole("button", { name: "+" }));

    expect(mockCambiarCantidad).toHaveBeenCalledTimes(1);
    expect(mockCambiarCantidad).toHaveBeenCalledWith(1, 3);
  });

  it("llama a la función onCambiarCantidad disminuyendo al presionar el botón '-'", async () => {
    const usuario = userEvent.setup();
    const mockCambiarCantidad = vi.fn();

    render(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={mockCambiarCantidad}
        onEliminar={() => {}}
        onVaciar={() => {}}
      />
    );

    await usuario.click(screen.getByRole("button", { name: "-" }));

    expect(mockCambiarCantidad).toHaveBeenCalledTimes(1);
    expect(mockCambiarCantidad).toHaveBeenCalledWith(1, 1);
  });

  it("llama a la función onEliminar con el ID correcto al presionar 'Eliminar'", async () => {
    const usuario = userEvent.setup();
    const mockEliminar = vi.fn();

    render(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={() => {}}
        onEliminar={mockEliminar}
        onVaciar={() => {}}
      />
    );

    await usuario.click(screen.getByRole("button", { name: /eliminar/i }));

    expect(mockEliminar).toHaveBeenCalledWith(1);
  });

  it("llama a la función onVaciar al presionar el botón 'Vaciar carrito'", async () => {
    const usuario = userEvent.setup();
    const mockVaciar = vi.fn();

    render(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={() => {}}
        onEliminar={() => {}}
        onVaciar={mockVaciar}
      />
    );

    await usuario.click(screen.getByRole("button", { name: /vaciar carrito/i }));

    expect(mockVaciar).toHaveBeenCalledTimes(1);
  });
});