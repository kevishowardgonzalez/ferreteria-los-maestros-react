// src/components/Carrito.spec.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Carrito from "./Carrito";

function renderConRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Pruebas Unitarias - Componente Carrito", () => {
  const carritoPrueba = [
    {
      id: 1,
      nombre: "Taladro Percutor 20V",
      precio: 59990,
      cantidad: 2,
      stock: 5,
    },
  ];

  it("muestra el mensaje de carrito vacío cuando no hay ítems", () => {
    renderConRouter(
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
    renderConRouter(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={() => {}}
        onEliminar={() => {}}
        onVaciar={() => {}}
      />
    );

    expect(screen.getByText("Taladro Percutor 20V")).toBeInTheDocument();
    // 59.990 * 2 = 119.980
    expect(screen.getByText(/Total:\s*\$119\.980/i)).toBeInTheDocument();
  });

  it("llama a la función onCambiarCantidad incrementando al presionar el botón '+'", async () => {
    const usuario = userEvent.setup();
    const mockCambiarCantidad = vi.fn();

    renderConRouter(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={mockCambiarCantidad}
        onEliminar={() => {}}
        onVaciar={() => {}}
      />
    );

    const botonAumentar = screen.getByRole("button", { name: "+" });
    await usuario.click(botonAumentar);

    expect(mockCambiarCantidad).toHaveBeenCalledTimes(1);
    expect(mockCambiarCantidad).toHaveBeenCalledWith(1, 3);
  });

  it("llama a la función onCambiarCantidad disminuyendo al presionar el botón '-'", async () => {
    const usuario = userEvent.setup();
    const mockCambiarCantidad = vi.fn();

    renderConRouter(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={mockCambiarCantidad}
        onEliminar={() => {}}
        onVaciar={() => {}}
      />
    );

    const botonDisminuir = screen.getByRole("button", { name: "-" });
    await usuario.click(botonDisminuir);

    expect(mockCambiarCantidad).toHaveBeenCalledTimes(1);
    expect(mockCambiarCantidad).toHaveBeenCalledWith(1, 1);
  });

  it("llama a la función onEliminar con el ID correcto al presionar 'Eliminar'", async () => {
    const usuario = userEvent.setup();
    const mockEliminar = vi.fn();

    renderConRouter(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={() => {}}
        onEliminar={mockEliminar}
        onVaciar={() => {}}
      />
    );

    const botonEliminar = screen.getByRole("button", { name: /eliminar/i });
    await usuario.click(botonEliminar);

    expect(mockEliminar).toHaveBeenCalledWith(1);
  });

  it("llama a la función onVaciar al presionar el botón 'Vaciar carrito'", async () => {
    const usuario = userEvent.setup();
    const mockVaciar = vi.fn();

    renderConRouter(
      <Carrito
        carrito={carritoPrueba}
        onCambiarCantidad={() => {}}
        onEliminar={() => {}}
        onVaciar={mockVaciar}
      />
    );

    const botonVaciar = screen.getByRole("button", { name: /vaciar carrito/i });
    await usuario.click(botonVaciar);

    expect(mockVaciar).toHaveBeenCalledTimes(1);
  });
});