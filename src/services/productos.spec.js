import { describe, it, expect, vi } from "vitest";

async function obtenerNombres(servicio) {
  const productos = await servicio.listar();
  return productos.map((producto) => producto.nombre);
}

describe("Servicio Asíncrono de Productos", () => {
  it("obtiene los nombres entregados por el servicio mediante mock", async () => {
    const servicio = {
      listar: vi.fn().mockResolvedValue([
        { id: 1, nombre: "Taladro Percutor 20V", stock: 8 }
      ])
    };

    const nombres = await obtenerNombres(servicio);

    expect(servicio.listar).toHaveBeenCalled();
    expect(nombres).toEqual(["Taladro Percutor 20V"]);
  });
});