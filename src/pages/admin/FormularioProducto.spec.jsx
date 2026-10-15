
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FormularioProducto from "./FormularioProducto";

describe("Formulario de productos", () => {

  // PRUEBA 27: CAMPOS OBLIGATORIOS
  it("rechaza un producto sin nombre ni categoria", async () => {
    const usuario = userEvent.setup();
    const guardar = vi.fn();

    render(
      <FormularioProducto onGuardar={guardar} />
    );

    await usuario.click(
      screen.getByRole("button", {
        name: "Guardar Producto"
      })
    );

    expect(
      screen.getByText("Nombre obligatorio")
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Selecciona categoría")
    ).toHaveLength(2);

    expect(guardar).not.toHaveBeenCalled();
  });

  // PRUEBA 28: PRECIO Y STOCK INVALIDOS
  it("rechaza precios no positivos y stock negativo", async () => {
    const usuario = userEvent.setup();
    const guardar = vi.fn();

    render(
      <FormularioProducto onGuardar={guardar} />
    );

    await usuario.type(
      screen.getByLabelText("Nombre del producto"),
      "Martillo"
    );

    await usuario.selectOptions(
      screen.getByLabelText("Categoría"),
      "Herramientas Manuales"
    );

    await usuario.type(
      screen.getByLabelText("Precio ($ CLP)"),
      "0"
    );

    await usuario.type(
      screen.getByLabelText("Stock inicial / actual"),
      "-2"
    );

    await usuario.click(
      screen.getByRole("button", {
        name: "Guardar Producto"
      })
    );

    expect(
      screen.getByText("Precio debe ser mayor a 0")
    ).toBeInTheDocument();

    expect(
      screen.getByText("El stock no puede ser negativo")
    ).toBeInTheDocument();

    expect(guardar).not.toHaveBeenCalled();
  });

  // PRUEBA 29: REGISTRO CORRECTO
  it("envia un producto valido para guardar", async () => {
    const usuario = userEvent.setup();
    const guardar = vi.fn();

    render(
      <FormularioProducto onGuardar={guardar} />
    );

    await usuario.type(
      screen.getByLabelText("Nombre del producto"),
      "Martillo de prueba"
    );

    await usuario.selectOptions(
      screen.getByLabelText("Categoría"),
      "Herramientas Manuales"
    );

    await usuario.type(
      screen.getByLabelText("Precio ($ CLP)"),
      "9990"
    );

    await usuario.type(
      screen.getByLabelText("Stock inicial / actual"),
      "15"
    );

    await usuario.click(
      screen.getByRole("button", {
        name: "Guardar Producto"
      })
    );

    expect(guardar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(Number),
        nombre: "Martillo de prueba",
        categoria: "Herramientas Manuales",
        precio: 9990,
        stock: 15
      })
    );
  });

  // PRUEBA 30: ACTUALIZACION DE PRODUCTO
  it("edita un producto conservando su ID", async () => {
    const usuario = userEvent.setup();
    const guardar = vi.fn();

    const productoExistente = {
      id: 100,
      nombre: "Martillo",
      categoria: "Herramientas Manuales",
      precio: 9990,
      stock: 10
    };

    render(
      <FormularioProducto
        onGuardar={guardar}
        productoAEditar={productoExistente}
      />
    );

    const campoPrecio = screen.getByLabelText(
      "Precio ($ CLP)"
    );

    await usuario.clear(campoPrecio);
    await usuario.type(campoPrecio, "12990");

    await usuario.click(
      screen.getByRole("button", {
        name: "Actualizar Producto"
      })
    );

    expect(guardar).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 100,
        nombre: "Martillo",
        precio: 12990,
        stock: 10
      })
    );
  });

});
