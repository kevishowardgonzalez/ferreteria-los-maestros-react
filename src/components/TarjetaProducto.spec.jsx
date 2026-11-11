// src/components/TarjetaProducto.spec.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import TarjetaProducto from "./TarjetaProducto";

describe("5. Componente TarjetaProducto", () => {
  const productoBase = {
    id: 1,
    nombre: "Esmeril Angular",
    categoria: "Herramientas Eléctricas",
    descripcion: "Corte y desbaste industrial",
    precio: 34990,
    stock: 8,
  };

  it("renderiza el título del producto recibido por props", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoBase} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Esmeril Angular")).toBeInTheDocument();
  });

  it("renderiza la categoría en su badge correspondiente", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoBase} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Herramientas Eléctricas")).toBeInTheDocument();
  });

  it("renderiza la descripción técnica del producto", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoBase} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Corte y desbaste industrial")).toBeInTheDocument();
  });

  it("muestra el precio formateado con signo de moneda chilena", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoBase} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/34\.990/)).toBeInTheDocument();
  });

  it("muestra el botón de compra habilitado con texto 'Añadir' si hay stock", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoBase} onAgregar={() => {}} />
      </MemoryRouter>
    );
    const boton = screen.getByRole("button", { name: /añadir/i });
    expect(boton).not.toBeDisabled();
  });

  it("muestra aviso visual de stock crítico cuando quedan 5 o menos unidades", () => {
    const prodCritico = { ...productoBase, stock: 3 };
    render(
      <MemoryRouter>
        <TarjetaProducto producto={prodCritico} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/últimas unidades/i)).toBeInTheDocument();
  });

  it("no muestra el aviso de stock crítico si el inventario supera las 5 unidades", () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoBase} onAgregar={() => {}} />
      </MemoryRouter>
    );
    expect(screen.queryByText(/últimas unidades/i)).not.toBeInTheDocument();
  });

  it("deshabilita el botón y cambia el texto a 'Sin stock' cuando el stock es 0", () => {
    const prodAgotado = { ...productoBase, stock: 0 };
    render(
      <MemoryRouter>
        <TarjetaProducto producto={prodAgotado} onAgregar={() => {}} />
      </MemoryRouter>
    );
    const boton = screen.getByRole("button", { name: /sin stock/i });
    expect(boton).toBeDisabled();
  });

  it("dispara la función onAgregar con el objeto producto al hacer clic", async () => {
    const usuario = userEvent.setup();
    const mockAgregar = vi.fn();
    render(
      <MemoryRouter>
        <TarjetaProducto producto={productoBase} onAgregar={mockAgregar} />
      </MemoryRouter>
    );

    await usuario.click(screen.getByRole("button", { name: /añadir/i }));
    expect(mockAgregar).toHaveBeenCalledTimes(1);
    expect(mockAgregar).toHaveBeenCalledWith(productoBase);
  });
});