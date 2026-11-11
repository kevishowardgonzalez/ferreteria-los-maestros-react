// src/utils/validaciones.spec.jsx
import { describe, it, expect } from "vitest";
import { validarRut, validarCorreo, validarStockYPrecio } from "./validaciones";

describe("validaciones.js", () => {
  describe("validarRut", () => {
    it("acepta un RUT chileno con formato y dígito verificador numérico correcto", () => {
      expect(validarRut("11.111.111-1")).toBe(true);
      expect(validarRut("12345678-5")).toBe(true);
    });

    it("valida correctamente un RUT terminado en dígito K (mayúscula y minúscula)", () => {
      expect(validarRut("1.000.005-K")).toBe(true);
      expect(validarRut("1000005-k")).toBe(true);
    });

    it("valida correctamente un RUT cuyo dígito verificador calculado sea 0 (Línea 23)", () => {
      // 20.000.008 suma ponderada = (8*2) + (2*3) = 22 -> 22 % 11 = 0 -> dvEsperado 11 -> retorna "0"
      expect(validarRut("20.000.008-0")).toBe(true);
      expect(validarRut("20000008-0")).toBe(true);
    });

    it("rechaza un RUT con dígito verificador erróneo", () => {
      expect(validarRut("11.111.111-2")).toBe(false);
    });

    it("rechaza entradas nulas, no string o de longitud insuficiente (Líneas 5-7)", () => {
      expect(validarRut(null)).toBe(false);
      expect(validarRut(undefined)).toBe(false);
      expect(validarRut(12345678)).toBe(false);
      expect(validarRut("")).toBe(false);
      expect(validarRut("123-4")).toBe(false);
    });
  });

  describe("validarCorreo", () => {
    it("aprueba correos autorizados (@duoc.cl, @profesor.duoc.cl y @gmail.com)", () => {
      expect(validarCorreo("alumno@duoc.cl")).toBe(true);
      expect(validarCorreo("docente@profesor.duoc.cl")).toBe(true);
      expect(validarCorreo("cliente@gmail.com")).toBe(true);
    });

    it("rechaza correos con dominios no autorizados", () => {
      expect(validarCorreo("persona@hotmail.com")).toBe(false);
      expect(validarCorreo("usuario@yahoo.es")).toBe(false);
    });

    it("rechaza entradas vacías o formatos sin estructura válida de correo (Líneas 27-31)", () => {
      expect(validarCorreo("")).toBe(false);
      expect(validarCorreo(null)).toBe(false);
      expect(validarCorreo(undefined)).toBe(false);
      expect(validarCorreo("correosinunarroba.cl")).toBe(false);
      expect(validarCorreo("dos@@arrobas.cl")).toBe(false);
    });
  });

  describe("validarStockYPrecio", () => {
    it("acepta precio mayor a 0 y stock no negativo", () => {
      expect(validarStockYPrecio(15000, 10)).toBe("");
      expect(validarStockYPrecio("5990", "0")).toBe("");
    });

    it("rechaza precios menores o iguales a cero", () => {
      expect(validarStockYPrecio(0, 5)).toBe("El precio debe ser mayor a 0");
      expect(validarStockYPrecio(-100, 5)).toBe("El precio debe ser mayor a 0");
    });

    it("rechaza stock negativo", () => {
      expect(validarStockYPrecio(1000, -1)).toBe("El stock no puede ser negativo");
      expect(validarStockYPrecio(1000, "-5")).toBe("El stock no puede ser negativo");
    });
  });
});