import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

it("consulta productos y categorías en sus endpoints independientes", async () => {
  const productosUrl = "http://localhost:8085/api/productos";
  const categoriasUrl = "http://localhost:8084/api/v1/categorias";
  vi.stubEnv("VITE_PRODUCTOS_API_URL", productosUrl + "/");
  vi.stubEnv("VITE_CATEGORIAS_API_URL", categoriasUrl + "/");

  const productos = [{ id: 1, nombre: "Martillo", categoria: "Herramientas" }];
  const categorias = [{ id: 1, nombre: "Herramientas", activo: true }];
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => productos })
    .mockResolvedValueOnce({ ok: true, json: async () => categorias });
  vi.stubGlobal("fetch", fetch);

  const { obtenerProductos } = await import("./productos");
  const { obtenerCategorias } = await import("./categorias");
  const { signal } = new AbortController();

  await expect(obtenerProductos(signal)).resolves.toEqual(productos);
  await expect(obtenerCategorias(signal)).resolves.toEqual(categorias);
  expect(fetch).toHaveBeenNthCalledWith(1, productosUrl, { signal });
  expect(fetch).toHaveBeenNthCalledWith(2, categoriasUrl, { signal });
});
