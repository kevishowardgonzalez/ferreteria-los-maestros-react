// src/utils/validaciones.spec.js
import { describe, it, expect } from "vitest";
import { validarRut, validarCorreo, validarStockYPrecio } from "./validaciones";

describe("validaciones", () => {
  it("acepta un RUT chileno con formato y dígito verificador correcto", () => {
    expect(validarRut("11.111.111-1")).toBe(true);
    expect(validarRut("12345678-5")).toBe(true);
  });

  it("valida correctamente un RUT terminado en dígito K", () => {
    expect(validarRut("1.000.005-K")).toBe(true);
    expect(validarRut("1000005-k")).toBe(true);
  });

  it("rechaza un RUT con dígito verificador erróneo", () => {
    expect(validarRut("11.111.111-2")).toBe(false);
  });

  it("aprueba correos institucionales de Duoc UC y cuentas Gmail", () => {
    expect(validarCorreo("usuario@duoc.cl")).toBe(true);
    expect(validarCorreo("cliente@gmail.com")).toBe(true);
  });

  it("rechaza correos con dominios no permitidos", () => {
    expect(validarCorreo("persona@hotmail.com")).toBe(false);
  });

  it("valida que precio y stock sean valores válidos", () => {
    expect(validarStockYPrecio(15000, 10)).toBe("");
    expect(validarStockYPrecio(0, 5)).toBe("El precio debe ser mayor a 0");
    expect(validarStockYPrecio(1000, -1)).toBe("El stock no puede ser negativo");
  });
});