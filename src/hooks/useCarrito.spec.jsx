// src/hooks/useCarrito.spec.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCarrito } from "./useCarrito";

describe("useCarrito", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("inicia con un carrito vacío y total 0", () => {
    const { result } = renderHook(() => useCarrito());
    expect(result.current.carrito).toEqual([]);
    expect(result.current.cantidadTotalCarrito).toBe(0);
  });

  it("agrega un nuevo producto al carrito con cantidad 1", () => {
    const { result } = renderHook(() => useCarrito());
    const producto = { id: 1, nombre: "Taladro", precio: 50000, stock: 5 };

    act(() => {
      result.current.agregarAlCarrito(producto);
    });

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].cantidad).toBe(1);
    expect(result.current.cantidadTotalCarrito).toBe(1);
  });

  it("incrementa la cantidad si el producto ya existía en el carrito", () => {
    const { result } = renderHook(() => useCarrito());
    const producto = { id: 1, nombre: "Taladro", precio: 50000, stock: 5 };

    act(() => {
      result.current.agregarAlCarrito(producto);
      result.current.agregarAlCarrito(producto);
    });

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].cantidad).toBe(2);
  });

  it("mantiene intactos los demás productos al incrementar uno existente (Cubre línea 18 : item)", () => {
    const { result } = renderHook(() => useCarrito());
    const prod1 = { id: 1, nombre: "Taladro", precio: 50000, stock: 5 };
    const prod2 = { id: 2, nombre: "Martillo", precio: 9990, stock: 10 };

    act(() => {
      result.current.agregarAlCarrito(prod1);
      result.current.agregarAlCarrito(prod2);
      // Incrementa prod2: para prod1 item.id === producto.id es false y retorna : item
      result.current.agregarAlCarrito(prod2);
    });

    expect(result.current.carrito).toHaveLength(2);
    expect(result.current.carrito[0].cantidad).toBe(1); // Taladro se mantiene
    expect(result.current.carrito[1].cantidad).toBe(2); // Martillo subió a 2
    expect(result.current.cantidadTotalCarrito).toBe(3);
  });

  it("bloquea el incremento si se alcanza el stock máximo disponible", () => {
    const alertaEspia = vi.spyOn(window, "alert").mockImplementation(() => { });
    const { result } = renderHook(() => useCarrito());
    const producto = { id: 1, nombre: "Taladro", precio: 50000, stock: 1 };

    act(() => {
      result.current.agregarAlCarrito(producto);
      result.current.agregarAlCarrito(producto);
    });

    expect(alertaEspia).toHaveBeenCalled();
    expect(result.current.carrito[0].cantidad).toBe(1);
  });

  it("modifica manualmente la cantidad de un ítem existente", () => {
    const { result } = renderHook(() => useCarrito());
    const producto = { id: 2, nombre: "Martillo", precio: 9990, stock: 10 };

    act(() => {
      result.current.agregarAlCarrito(producto);
      result.current.cambiarCantidad(2, 5);
    });

    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].cantidad).toBe(5);
    expect(result.current.cantidadTotalCarrito).toBe(5);
  });

  it("elimina un producto del carrito según su identificador", () => {
    const { result } = renderHook(() => useCarrito());
    const producto = { id: 3, nombre: "Huincha", precio: 2990, stock: 10 };

    act(() => {
      result.current.agregarAlCarrito(producto);
      result.current.eliminarDelCarrito(3);
    });

    expect(result.current.carrito).toHaveLength(0);
  });

  it("vacía por completo todos los elementos del carrito", () => {
    const { result } = renderHook(() => useCarrito());
    act(() => {
      result.current.agregarAlCarrito({ id: 1, stock: 5 });
      result.current.agregarAlCarrito({ id: 2, stock: 5 });
      result.current.vaciarCarrito();
    });

    expect(result.current.carrito).toHaveLength(0);
    expect(result.current.cantidadTotalCarrito).toBe(0);
  });

  it("sincroniza automáticamente los cambios del carrito en localStorage", () => {
    const { result } = renderHook(() => useCarrito());
    act(() => {
      result.current.agregarAlCarrito({ id: 1, nombre: "Clavos", stock: 50 });
    });

    const guardado = JSON.parse(localStorage.getItem("carrito_los_maestros"));
    expect(guardado).toHaveLength(1);
    expect(guardado[0].id).toBe(1);
  });

  it("ignora modificar la cantidad si el id no coincide con ningún producto", () => {
    const { result } = renderHook(() => useCarrito());
    act(() => {
      result.current.agregarAlCarrito({ id: 1, nombre: "Clavos", stock: 50 });
      result.current.cambiarCantidad(999, 10);
    });
    expect(result.current.carrito[0].cantidad).toBe(1);
  });
});