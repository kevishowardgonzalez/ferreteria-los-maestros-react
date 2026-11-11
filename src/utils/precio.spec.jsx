// src/utils/precio.spec.jsx
import { describe, it, expect } from "vitest";
import { formatearPrecio, calcularDescuento } from "./precio";

describe("1. Utilidades de Precio y Moneda", () => {
  it("retorna 'Sin costo' si el precio es 0", () => {
    expect(formatearPrecio(0)).toBe("Sin costo");
  });

  it("retorna 'Sin costo' si se entrega un valor nulo o undefined", () => {
    expect(formatearPrecio(null)).toBe("Sin costo");
    expect(formatearPrecio(undefined)).toBe("Sin costo");
  });

  it("formatea números grandes con separador de miles en formato chileno", () => {
    expect(formatearPrecio(59990)).toContain("59.990");
    expect(formatearPrecio(1200500)).toContain("1.200.500");
  });

  it("aplica descuento porcentual correctamente redondeando al entero", () => {
    // 10.000 con 15% de descuento = 8.500
    expect(calcularDescuento(10000, 15)).toBe(8500);
  });

  it("devuelve el precio base si el porcentaje de descuento es 0 o negativo", () => {
    expect(calcularDescuento(5000, 0)).toBe(5000);
    expect(calcularDescuento(5000, -10)).toBe(5000);
  });
});