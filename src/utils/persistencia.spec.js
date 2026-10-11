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