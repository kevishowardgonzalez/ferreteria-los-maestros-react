// src/components/DetalleProducto.spec.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DetalleProducto from "./DetalleProducto";

let mockId = "1";
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: mockId }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("DetalleProducto", () => {
  const inventario = [
    {
      id: 1,
      nombre: "Taladro Percutor 20V",
      categoria: "Herramientas Eléctricas",
      descripcion: "Motor sin carbones brushless",
      precio: 59990,
      stock: 5,
    },
    {
      id: 2,
      nombre: "Sierra Caladora",
      categoria: "Herramientas Eléctricas",
      descripcion: "Corte curvo en madera",
      precio: 29990,
      stock: 0,
    },
  ];

  it("encuentra y renderiza el producto correspondiente al ID de la URL", () => {
    mockId = "1";
    render(<DetalleProducto productos={inventario} />);
    expect(screen.getByRole("heading", { name: "Taladro Percutor 20V" })).toBeInTheDocument();
  });

  it("muestra la descripción extendida del producto", () => {
    mockId = "1";
    render(<DetalleProducto productos={inventario} />);
    expect(screen.getByText("Motor sin carbones brushless")).toBeInTheDocument();
  });

  it("muestra la cantidad exacta de unidades disponibles en bodega", () => {
    mockId = "1";
    render(<DetalleProducto productos={inventario} />);
    expect(screen.getByText(/5 unidades/i)).toBeInTheDocument();
  });

  it("muestra advertencia de producto sin stock cuando stock es 0", () => {
    mockId = "2";
    render(<DetalleProducto productos={inventario} />);
    expect(screen.getByText(/producto sin stock disponible/i)).toBeInTheDocument();
  });

  it("renderiza mensaje de error 'Producto no encontrado' para IDs inexistentes", () => {
    mockId = "999";
    render(<DetalleProducto productos={inventario} />);
    expect(screen.getByText("Producto no encontrado")).toBeInTheDocument();
  });

  it("proporciona un botón para volver al catálogo cuando el producto no existe", () => {
    mockId = "999";
    render(<DetalleProducto productos={inventario} />);
    const enlace = screen.getByRole("link", { name: /volver al catálogo/i });
    expect(enlace).toHaveAttribute("href", "/productos");
  });
});