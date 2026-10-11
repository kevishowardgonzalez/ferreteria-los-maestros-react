
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import Checkout from "./Checkout";

describe("Pruebas unitarias - Checkout", () => {

  const carrito = [
    {
      id: 1,
      nombre: "Taladro Percutor 20V",
      precio: 59990,
      cantidad: 1,
      stock: 8
    }
  ];

  // Función para completar el formulario de prueba
  async function completarFormulario(usuario) {
    await usuario.type(
      screen.getByLabelText("Nombre"), "Juan"
    );

    await usuario.type(
      screen.getByLabelText("Apellido"), "Perez"
    );

    await usuario.type(
      screen.getByLabelText("Correo electrónico"),
      "juan@gmail.com"
    );

    await usuario.type(
      screen.getByLabelText("Calle"), "Los Maestros"
    );

    await usuario.type(
      screen.getByLabelText("Número"), "123"
    );

    await usuario.type(
      screen.getByLabelText("Región"), "Coquimbo"
    );

    await usuario.type(
      screen.getByLabelText("Comuna"), "La Serena"
    );
  }

  // PRUEBA 1: Validaciones del formulario
  it("Muestra errores cuando los campos están vacíos", async () => {

    const usuario = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout
          carrito={carrito}
          onCompraExitosa={() => {}}
        />
      </BrowserRouter>
    );

    await usuario.click(
      screen.getByRole("button", {
        name: "Finalizar compra"
      })
    );

    expect(
      screen.getByText("El nombre es obligatorio")
    ).toBeInTheDocument();

    expect(
      screen.getByText("El apellido es obligatorio")
    ).toBeInTheDocument();

  });

  // PRUEBA 2: Compra aprobada
  it("Realiza una compra simulada exitosa", async () => {

    const usuario = userEvent.setup();
    const compraMock = vi.fn();

    render(
      <BrowserRouter>
        <Checkout
          carrito={carrito}
          onCompraExitosa={compraMock}
        />
      </BrowserRouter>
    );

    await completarFormulario(usuario);

    await usuario.click(
      screen.getByRole("button", {
        name: "Finalizar compra"
      })
    );

    expect(
      screen.getByText("Compra simulada exitosa")
    ).toBeInTheDocument();

    expect(compraMock).toHaveBeenCalledTimes(1);

  });

  // PRUEBA 3: Compra rechazada
  it("Mantiene el carrito cuando el pago es rechazado", async () => {

    const usuario = userEvent.setup();
    const compraMock = vi.fn();

    render(
      <BrowserRouter>
        <Checkout
          carrito={carrito}
          onCompraExitosa={compraMock}
        />
      </BrowserRouter>
    );

    await completarFormulario(usuario);

    await usuario.selectOptions(
      screen.getByLabelText("Resultado del pago"),
      "rechazado"
    );

    await usuario.click(
      screen.getByRole("button", {
        name: "Finalizar compra"
      })
    );

    expect(
      screen.getByText("Pago simulado rechazado")
    ).toBeInTheDocument();

    expect(compraMock).not.toHaveBeenCalled();

  });


  // PRUEBA 4: Reintentar pago rechazado
  it("Permite volver a intentar un pago rechazado", async () => {

    const usuario = userEvent.setup();
    const compraMock = vi.fn();

    render(
      <BrowserRouter>
        <Checkout
          carrito={carrito}
          onCompraExitosa={compraMock}
        />
      </BrowserRouter>
    );

    // Completar el formulario
    await completarFormulario(usuario);

    // Seleccionar pago rechazado
    await usuario.selectOptions(
      screen.getByLabelText("Resultado del pago"),
      "rechazado"
    );

    // Intentar finalizar la compra
    await usuario.click(
      screen.getByRole("button", {
        name: "Finalizar compra"
      })
    );

    // Verificar que aparezca el botón de reintento
    const botonReintentar = screen.getByRole("button", {
      name: "Volver a intentar"
    });

    await usuario.click(botonReintentar);

    // Comprobar que vuelve al formulario
    expect(
      screen.getByRole("button", {
        name: "Finalizar compra"
      })
    ).toBeInTheDocument();

    expect(compraMock).not.toHaveBeenCalled();

  });

  // PRUEBA 5: Checkout sin productos
  it("Muestra mensaje cuando el carrito está vacío", () => {

    render(
      <BrowserRouter>
        <Checkout
          carrito={[]}
          onCompraExitosa={() => {}}
        />
      </BrowserRouter>
    );

    expect(
      screen.getByText("No tienes productos en el carrito.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Volver al catálogo"
      })
    ).toBeInTheDocument();

  });


});