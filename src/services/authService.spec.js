import { afterEach, expect, it, vi } from "vitest";
import { renovarSesion } from "./authService";

afterEach(() => vi.unstubAllGlobals());

it("envía el JWT vigente en el cuerpo del contrato de renovación", async () => {
  const fetchApi = vi.fn(async () => Response.json({ token: "jwt-renovado" }));
  vi.stubGlobal("fetch", fetchApi);
  await expect(renovarSesion("jwt-vigente")).resolves.toEqual({ token: "jwt-renovado" });
  const [[url, solicitud]] = fetchApi.mock.calls;
  expect(new URL(url).pathname).toBe("/api/v1/auth/refresh");
  expect(solicitud.headers.has("Authorization")).toBe(false);
  expect(JSON.parse(solicitud.body)).toEqual({ token: "jwt-vigente" });
});
