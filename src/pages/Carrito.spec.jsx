
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import Carrito from "./Carrito";

describe("Pruebas unitarias - Carrito de compras", () => {

  const carrito = [
    {
      id: 1,
      nombre: "Taladro Percutor 20V",
      precio: 59990,
      cantidad: 2,
      stock: 8
    }
  ];

  // PRUEBA 1: Carrito vacío
  it("Muestra mensaje cuando el carrito está vacío", () => {

    render(
      <BrowserRouter>
        <Carrito
          carrito={[]}
          onCambiarCantidad={() => {}}
          onEliminar={() => {}}
          onVaciar={() => {}}
        />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Tu carrito está vacío.")
    ).toBeInTheDocument();

  });

  // PRUEBA 2: Calcular el total
  it("Calcula correctamente el total de los productos", () => {

    render(
      <BrowserRouter>
        <Carrito
          carrito={carrito}
          onCambiarCantidad={() => {}}
          onEliminar={() => {}}
          onVaciar={() => {}}
        />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Total: $119.980")
    ).toBeInTheDocument();

  });

  // PRUEBA 3: Eliminar producto
  it("Ejecuta la función eliminar al presionar el botón", async () => {

    const usuario = userEvent.setup();

    const eliminarMock = vi.fn();

    render(
      <BrowserRouter>
        <Carrito
          carrito={carrito}
          onCambiarCantidad={() => {}}
          onEliminar={eliminarMock}
          onVaciar={() => {}}
        />
      </BrowserRouter>
    );

    const boton = screen.getByRole(
      "button",
      { name: "Eliminar" }
    );

    await usuario.click(boton);

    expect(eliminarMock).toHaveBeenCalledWith(1);

  });


  // PRUEBA 4: Aumentar cantidad
  it("Aumenta la cantidad del producto al presionar +", async () => {

    const usuario = userEvent.setup();
    const cambiarCantidadMock = vi.fn();

    render(
      <BrowserRouter>
        <Carrito
          carrito={carrito}
          onCambiarCantidad={cambiarCantidadMock}
          onEliminar={() => {}}
          onVaciar={() => {}}
        />
      </BrowserRouter>
    );

    await usuario.click(
      screen.getByRole("button", { name: "+" })
    );

    expect(cambiarCantidadMock).toHaveBeenCalledWith(1, 3);

  });

  // PRUEBA 5: Disminuir cantidad
  it("Disminuye la cantidad del producto al presionar -", async () => {

    const usuario = userEvent.setup();
    const cambiarCantidadMock = vi.fn();

    render(
      <BrowserRouter>
        <Carrito
          carrito={carrito}
          onCambiarCantidad={cambiarCantidadMock}
          onEliminar={() => {}}
          onVaciar={() => {}}
        />
      </BrowserRouter>
    );

    await usuario.click(
      screen.getByRole("button", { name: "-" })
    );

    expect(cambiarCantidadMock).toHaveBeenCalledWith(1, 1);

  });

});
