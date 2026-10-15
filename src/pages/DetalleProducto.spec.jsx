
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import DetalleProducto from "./DetalleProducto";

// Datos de prueba
const productosPrueba = [
  {
    id: 1,
    nombre: "Taladro de prueba",
    categoria: "Herramientas Eléctricas",
    descripcion: "Taladro eléctrico de 20V",
    precio: 59990,
    stock: 8
  },
  {
    id: 2,
    nombre: "Martillo de prueba",
    categoria: "Herramientas Manuales",
    descripcion: "Martillo de acero",
    precio: 9990,
    stock: 0
  }
];

// Función auxiliar para renderizar el detalle
function mostrarDetalle(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route
          path="/productos/:id"
          element={
            <DetalleProducto productos={productosPrueba} />
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("Pruebas unitarias - Detalle de productos", () => {

  // PRUEBA 24: Mostrar un producto existente
  it("Muestra correctamente los datos del producto", () => {
    mostrarDetalle("/productos/1");

    expect(
      screen.getByRole("heading", {
        name: "Taladro de prueba"
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Taladro eléctrico de 20V")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/59\.990/)
    ).toBeInTheDocument();
  });

  // PRUEBA 25: Producto sin stock
  it("Muestra una advertencia cuando el stock es cero", () => {
    mostrarDetalle("/productos/2");

    expect(
      screen.getByText("Producto sin stock disponible.")
    ).toBeInTheDocument();
  });

  // PRUEBA 26: Producto inexistente
  it("Muestra un error si el producto no existe", () => {
    mostrarDetalle("/productos/999");

    expect(
      screen.getByText(/El producto solicitado no existe/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Volver al catálogo"
      })
    ).toHaveAttribute("href", "/productos");
  });

});
