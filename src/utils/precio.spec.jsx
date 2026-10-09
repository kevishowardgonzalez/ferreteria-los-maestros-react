import { describe, it, expect } from "vitest";
import { formatearPrecio } from "./precio";

describe("Pruebas Unitarias - Utilidad de Precios (Ferretería Los Maestros)", () => {
    it("muestra productos con valor cero como 'Sin costo'", () => {
        expect(formatearPrecio(0)).toBe("Sin costo");
    });

    it("formatea el precio de un producto en pesos chilenos con separador de miles", () => {
        expect(formatearPrecio(45990)).toContain("45.990");
    });
});