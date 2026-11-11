// src/utils/carrito.spec.js
import { describe, it, expect } from "vitest";
import { calcularTotal } from "./carrito";

describe("calcularTotal", () => {
    it("calcula la suma acumulada del precio multiplicado por la cantidad", () => {
        const items = [
            { id: 1, precio: 50000, cantidad: 2 },
            { id: 2, precio: 9990, cantidad: 1 },
        ];
        // (50000 * 2) + (9990 * 1) = 109990
        expect(calcularTotal(items)).toBe(109990);
    });

    it("retorna 0 si se entrega un arreglo vacío", () => {
        expect(calcularTotal([])).toBe(0);
    });

    it("retorna 0 si el parámetro no es un arreglo (Cubre línea 3)", () => {
        expect(calcularTotal(null)).toBe(0);
        expect(calcularTotal(undefined)).toBe(0);
        expect(calcularTotal("texto_invalido")).toBe(0);
    });
});