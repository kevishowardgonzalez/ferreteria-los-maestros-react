import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const servicios = [
  ["auth", "VITE_AUTH_API_URL", 8081],
  ["usuarios", "VITE_USUARIOS_API_URL", 8082],
  ["roles", "VITE_ROLES_API_URL", 8083],
  ["categorias", "VITE_CATEGORIAS_API_URL", 8084],
  ["productos", "VITE_PRODUCTOS_API_URL", 8085],
  ["inventario", "VITE_INVENTARIO_API_URL", 8086],
  ["boletas", "VITE_BOLETAS_API_URL", 8087],
  ["carrito", "VITE_CARRITO_API_URL", 8088],
  ["contacto", "VITE_CONTACTO_API_URL", 8089],
  ["foro", "VITE_FORO_API_URL", 8090],
];

describe("configuración de las API", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("define las URLs locales de los diez microservicios", async () => {
    for (const [, variable] of servicios) vi.stubEnv(variable, undefined);

    const { URLS_API } = await import("./api");
    expect(URLS_API).toEqual(Object.fromEntries(
      servicios.map(([servicio, , puerto]) => [servicio, `http://localhost:${puerto}`]),
    ));
  });

  it("lee la variable correspondiente a cada servicio y normaliza su URL", async () => {
    const esperado = {};
    for (const [servicio, variable] of servicios) {
      const url = servicio === "auth"
        ? "https://auth.example.test"
        : `/proxy/${servicio}`;
      vi.stubEnv(variable, `  ${url}///  `);
      esperado[servicio] = url;
    }

    const { URLS_API } = await import("./api");
    expect(URLS_API).toEqual(esperado);
  });

  it("documenta las diez variables y sus puertos en .env.example", () => {
    const ejemplo = parseEnv(readFileSync(".env.example", "utf8"));
    expect(ejemplo).toEqual(Object.fromEntries(
      servicios.map(([, variable, puerto]) => [variable, `http://localhost:${puerto}`]),
    ));
  });
});
