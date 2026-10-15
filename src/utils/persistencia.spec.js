import { describe, it, expect, vi } from "vitest";
import { guardarCarrito } from "./persistencia";

describe("guardarCarrito", () => {
  it("guarda el arreglo serializado usando localStorage", () => {
    const espia = vi.spyOn(Storage.prototype, "setItem");
    const datos = [{ id: 1, nombre: "Taladro Percutor 20V", cantidad: 1 }];

    guardarCarrito(datos);

    expect(espia).toHaveBeenCalledWith(
      "carrito_los_maestros",
      JSON.stringify(datos)
    );
    espia.mockRestore();
  });
});


import {
  obtenerProductos,
  guardarProductos
} from "./persistencia";

describe("Persistencia de productos", () => {

  it("utiliza los productos iniciales si no hay datos guardados", () => {
    localStorage.removeItem("productos_los_maestros");

    const iniciales = [
      { id: 1, nombre: "Taladro", precio: 59990 }
    ];

    const resultado = obtenerProductos(iniciales);

    expect(resultado).toEqual(iniciales);
  });

  it("recupera los productos guardados en localStorage", () => {
    const productos = [
      { id: 2, nombre: "Martillo", precio: 9990 }
    ];

    localStorage.setItem(
      "productos_los_maestros",
      JSON.stringify(productos)
    );

    const resultado = obtenerProductos([]);

    expect(resultado).toEqual(productos);

    localStorage.removeItem("productos_los_maestros");
  });

  it("guarda correctamente un arreglo de productos", () => {
    const productos = [
      { id: 3, nombre: "Cemento", precio: 6490 }
    ];

    guardarProductos(productos);

    expect(
      JSON.parse(
        localStorage.getItem("productos_los_maestros")
      )
    ).toEqual(productos);

    localStorage.removeItem("productos_los_maestros");
  });

});
