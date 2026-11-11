// src/components/TarjetaProducto.spec.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TarjetaProducto from "./TarjetaProducto";
import { productos } from "../data/productos";

describe("TarjetaProducto", () => {
  const taladroDisponible = {
    id: 1,
    nombre: "Taladro Percutor 20V",
    categoria: "Herramientas Eléctricas",
    descripcion: "Mandril de 13mm con 2 baterías de litio.",
    precio: 45990,
    stock: 8,
  };

  const productoCritico = {
    id: 2,
    nombre: "Esmeril Angular 4 1/2",
    categoria: "Herramientas Eléctricas",
    descripcion: "Velocidad de 11.000 RPM para corte.",
    precio: 34990,
    stock: 3,
  };

  const cementoAgotado = {
    id: 3,
    nombre: "Saco de Cemento Especial 25 kg",
    categoria: "Construcción",
    descripcion: "Cemento de alta resistencia para obras.",
    precio: 4990,
    stock: 0,
  };

  it("muestra el nombre recibido por props", () => {
    render(<TarjetaProducto producto={taladroDisponible} onAgregar={() => {}} />);
    expect(screen.getByText("Taladro Percutor 20V")).toBeInTheDocument();
  });

  it("muestra la categoría y descripción recibidas por props", () => {
    render(<TarjetaProducto producto={taladroDisponible} onAgregar={() => {}} />);
    expect(screen.getByText("Herramientas Eléctricas")).toBeInTheDocument();
    expect(screen.getByText("Mandril de 13mm con 2 baterías de litio.")).toBeInTheDocument();
  });

  it("muestra el botón habilitado cuando el producto tiene stock", () => {
    render(<TarjetaProducto producto={taladroDisponible} onAgregar={() => {}} />);
    const boton = screen.getByRole("button", { name: /añadir al carrito/i });
    expect(boton).toBeInTheDocument();
    expect(boton).not.toBeDisabled();
  });

  it("muestra aviso condicional de stock crítico cuando quedan 5 o menos unidades", () => {
    render(<TarjetaProducto producto={productoCritico} onAgregar={() => {}} />);
    expect(screen.getByText(/¡últimas unidades!/i)).toBeInTheDocument();
  });

  it("deshabilita el botón y muestra 'Sin stock' cuando el stock es 0", () => {
    render(<TarjetaProducto producto={cementoAgotado} onAgregar={() => {}} />);
    const boton = screen.getByRole("button", { name: /sin stock/i });
    expect(boton).toBeInTheDocument();
    expect(boton).toBeDisabled();
  });

  it("ejecuta onAgregar al presionar el botón", async () => {
    const usuario = userEvent.setup();
    const onAgregarMock = vi.fn();

    render(<TarjetaProducto producto={taladroDisponible} onAgregar={onAgregarMock} />);

    await usuario.click(screen.getByRole("button", { name: /añadir al carrito/i }));

    expect(onAgregarMock).toHaveBeenCalledTimes(1);
    expect(onAgregarMock).toHaveBeenCalledWith(taladroDisponible);
  });

  it("valida que el catálogo de datos contenga los productos con id, precio y stock numéricos", () => {
    expect(productos.length).toBeGreaterThanOrEqual(4);
    productos.forEach((item) => {
      expect(typeof item.id).toBe("number");
      expect(typeof item.precio).toBe("number");
      expect(item.precio).toBeGreaterThan(0);
      expect(typeof item.stock).toBe("number");
      expect(item.stock).toBeGreaterThanOrEqual(0);
    });
  });

  it("filtra los productos devolviendo solo los pertenecientes a la categoría seleccionada", () => {
    const categoriaFiltro = "Herramientas Eléctricas";
    const filtrados = productos.filter((p) => p.categoria === categoriaFiltro);

    expect(filtrados.length).toBeGreaterThan(0);
    filtrados.forEach((prod) => {
      expect(prod.categoria).toBe(categoriaFiltro);
    });
  });

  it("devuelve la totalidad de los productos cuando la categoría es 'Todas'", () => {
    const categoriaFiltro = "Todas";
    const resultado =
      categoriaFiltro === "Todas"
        ? productos
        : productos.filter((p) => p.categoria === categoriaFiltro);

    expect(resultado.length).toBe(productos.length);
  });
});