// src/utils/validaciones.spec.js
import { describe, it, expect } from "vitest";
import {
  validarRut,
  validarCorreo,
  validarStockYPrecio
} from "./validaciones";

describe("Pruebas Unitarias - Validaciones de Negocio", () => {
  describe("validarRut (Algoritmo Módulo 11)", () => {
    it("acepta un RUT chileno con formato y dígito verificador correcto", () => {
      expect(validarRut("11.111.111-1")).toBe(true);
      expect(validarRut("12345678-5")).toBe(true);
    });

    it("valida correctamente un RUT terminado en dígito K (mayúscula y minúscula)", () => {
      expect(validarRut("1.000.005-K")).toBe(true);
      expect(validarRut("1000005-k")).toBe(true);
    });

    it("rechaza un RUT con dígito verificador erróneo", () => {
      expect(validarRut("11.111.111-2")).toBe(false);
      expect(validarRut("12345678-9")).toBe(false);
    });

    it("rechaza entradas vacías, incompletas o no textuales", () => {
      expect(validarRut("")).toBe(false);
      expect(validarRut("123")).toBe(false);
      expect(validarRut(null)).toBe(false);
      expect(validarRut(undefined)).toBe(false);
    });
  });

  describe("validarCorreo (Dominios autorizados)", () => {
    it("aprueba correos institucionales de Duoc UC y cuentas Gmail", () => {
      expect(validarCorreo("usuario@duoc.cl")).toBe(true);
      expect(validarCorreo("profesor@profesor.duoc.cl")).toBe(true);
      expect(validarCorreo("cliente@gmail.com")).toBe(true);
    });

    it("rechaza correos con dominios corporativos o no permitidos", () => {
      expect(validarCorreo("persona@hotmail.com")).toBe(false);
      expect(validarCorreo("test@yahoo.es")).toBe(false);
    });

    it("rechaza textos que no posean la estructura de un correo electrónico", () => {
      expect(validarCorreo("correo_invalido")).toBe(false);
      expect(validarCorreo("")).toBe(false);
      expect(validarCorreo(null)).toBe(false);
    });
  });

  describe("validarStockYPrecio", () => {
    it("acepta valores positivos y mayores a cero", () => {
      expect(validarStockYPrecio(15000, 10)).toBe("");
    });

    it("rechaza precios menores o iguales a cero", () => {
      expect(validarStockYPrecio(0, 5)).toBe("El precio debe ser mayor a 0");
      expect(validarStockYPrecio(-5000, 5)).toBe("El precio debe ser mayor a 0");
    });

    it("rechaza cantidades de inventario negativas", () => {
      expect(validarStockYPrecio(12000, -3)).toBe("El stock no puede ser negativo");
    });
  });
});