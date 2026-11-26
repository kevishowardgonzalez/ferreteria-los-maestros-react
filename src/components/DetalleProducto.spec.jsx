// src/components/DetalleProducto.spec.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DetalleProducto from "./DetalleProducto";

const api = vi.hoisted(() => ({ buscarProducto: vi.fn() }));
vi.mock("../services/productos", () => api);

vi.mock("../services/inventario", () => ({
  consultarExistencias: vi.fn(async (id) => ({ stockActual: id === 1 ? 5 : 0, stockMinimo: 5 })),
}));

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

  it("encuentra y renderiza el producto correspondiente al ID de la URL", async () => {
    mockId = "1";
    api.buscarProducto.mockImplementation(async (id) => {
      const producto = inventario.find((item) => item.id === Number(id));
      if (!producto) throw Object.assign(new Error("Producto no encontrado"), { estado: 404 });
      return producto;
    });
    render(<DetalleProducto />);
    await screen.findByRole("heading");
    expect(screen.getByRole("heading", { name: "Taladro Percutor 20V" })).toBeInTheDocument();
  });

  it("muestra la descripción extendida del producto", async () => {
    mockId = "1";
    api.buscarProducto.mockImplementation(async (id) => {
      const producto = inventario.find((item) => item.id === Number(id));
      if (!producto) throw Object.assign(new Error("Producto no encontrado"), { estado: 404 });
      return producto;
    });
    render(<DetalleProducto />);
    await screen.findByRole("heading");
    expect(screen.getByText("Motor sin carbones brushless")).toBeInTheDocument();
  });

  it("muestra la cantidad exacta de unidades disponibles en bodega", async () => {
    mockId = "1";
    api.buscarProducto.mockImplementation(async (id) => {
      const producto = inventario.find((item) => item.id === Number(id));
      if (!producto) throw Object.assign(new Error("Producto no encontrado"), { estado: 404 });
      return producto;
    });
    render(<DetalleProducto />);
    await screen.findByRole("heading");
    expect(await screen.findByText(/5 unidades/i)).toBeInTheDocument();
  });

  it("muestra advertencia de producto sin stock cuando stock es 0", async () => {
    mockId = "2";
    api.buscarProducto.mockImplementation(async (id) => {
      const producto = inventario.find((item) => item.id === Number(id));
      if (!producto) throw Object.assign(new Error("Producto no encontrado"), { estado: 404 });
      return producto;
    });
    render(<DetalleProducto />);
    await screen.findByRole("heading");
    expect(await screen.findByText(/producto sin stock disponible/i)).toBeInTheDocument();
  });

  it("renderiza mensaje de error 'Producto no encontrado' para IDs inexistentes", async () => {
    mockId = "999";
    api.buscarProducto.mockImplementation(async (id) => {
      const producto = inventario.find((item) => item.id === Number(id));
      if (!producto) throw Object.assign(new Error("Producto no encontrado"), { estado: 404 });
      return producto;
    });
    render(<DetalleProducto />);
    await screen.findByRole("heading");
    expect(screen.getByText("Producto no encontrado")).toBeInTheDocument();
  });

  it("proporciona un botón para volver al catálogo cuando el producto no existe", async () => {
    mockId = "999";
    api.buscarProducto.mockImplementation(async (id) => {
      const producto = inventario.find((item) => item.id === Number(id));
      if (!producto) throw Object.assign(new Error("Producto no encontrado"), { estado: 404 });
      return producto;
    });
    render(<DetalleProducto />);
    await screen.findByRole("heading");
    const enlace = screen.getByRole("link", { name: /volver al catálogo/i });
    expect(enlace).toHaveAttribute("href", "/productos");
  });
});