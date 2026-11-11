// src/utils/persistencia.spec.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  guardarCarrito,
  obtenerCarrito,
  guardarSesion,
  obtenerSesion,
  cerrarSesionStorage,
  guardarOrdenCliente,
  obtenerOrdenesCliente,
  obtenerProductos,
  guardarProductos,
} from "./persistencia";

describe("persistencia.js", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("guarda el carrito y lo recupera correctamente de localStorage", () => {
    const espia = vi.spyOn(Storage.prototype, "setItem");
    const datos = [{ id: 1, nombre: "Taladro", cantidad: 1 }];

    guardarCarrito(datos);
    expect(espia).toHaveBeenCalledWith("carrito_los_maestros", JSON.stringify(datos));
    expect(obtenerCarrito()).toEqual(datos);
  });

  it("retorna un arreglo vacío si el carrito no existe en localStorage", () => {
    expect(obtenerCarrito()).toEqual([]);
  });

  it("maneja el almacenamiento y recuperación de la sesión de usuario", () => {
    const usuario = { correo: "admin@duoc.cl", rol: "Administrador" };
    guardarSesion(usuario);
    expect(obtenerSesion()).toEqual(usuario);

    cerrarSesionStorage();
    expect(obtenerSesion()).toBeNull();
  });

  it("guarda y recupera el historial de órdenes del cliente", () => {
    expect(obtenerOrdenesCliente()).toEqual([]);

    const orden1 = { id: 101, total: 45000 };
    guardarOrdenCliente(orden1);
    expect(obtenerOrdenesCliente()).toEqual([orden1]);

    const orden2 = { id: 102, total: 12000 };
    guardarOrdenCliente(orden2);
    expect(obtenerOrdenesCliente()).toEqual([orden2, orden1]);
  });

  it("obtiene la lista inicial de productos si no hay registro previo", () => {
    const listaInicial = [{ id: 1, nombre: "Martillo" }];
    expect(obtenerProductos(listaInicial)).toEqual(listaInicial);

    const actualizados = [{ id: 1, nombre: "Martillo Grande" }];
    guardarProductos(actualizados);
    expect(obtenerProductos(listaInicial)).toEqual(actualizados);
  });
});