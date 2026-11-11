// src/components/DetalleProducto.spec.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DetalleProducto from "./DetalleProducto";

describe("6. Componente DetalleProducto (Ficha técnica y rutas)", () => {
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

  function renderDetalle(idRuta) {
    return render(
      <MemoryRouter initialEntries={[`/productos/${idRuta}`]}>
        <Routes>
          <Route
            path="/productos/:id"
            element={<DetalleProducto productos={inventario} />}
          />
        </Routes>
      </MemoryRouter>
    );
  }

  it("encuentra y renderiza el producto correspondiente al ID de la URL", () => {
    renderDetalle(1);
    expect(screen.getByRole("heading", { name: "Taladro Percutor 20V" })).toBeInTheDocument();
  });

  it("muestra la descripción extendida del producto", () => {
    renderDetalle(1);
    expect(screen.getByText("Motor sin carbones brushless")).toBeInTheDocument();
  });

  it("muestra la cantidad exacta de unidades disponibles en bodega", () => {
    renderDetalle(1);
    expect(screen.getByText(/5 unidades/i)).toBeInTheDocument();
  });

  it("muestra advertencia de producto sin stock cuando stock es 0", () => {
    renderDetalle(2);
    expect(screen.getByText(/producto sin stock disponible/i)).toBeInTheDocument();
  });

  it("renderiza mensaje de error 'Producto no encontrado' para IDs inexistentes", () => {
    renderDetalle(999);
    expect(screen.getByText("Producto no encontrado")).toBeInTheDocument();
  });

  it("proporciona un botón para volver al catálogo cuando el producto no existe", () => {
    renderDetalle(999);
    const enlace = screen.getByRole("link", { name: /volver al catálogo/i });
    expect(enlace).toHaveAttribute("href", "/productos");
  });
});