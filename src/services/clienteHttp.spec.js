import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clienteHttp,
  construirUrl,
  ErrorHttp,
} from "./clienteHttp";

function crearRespuesta(estado, cuerpo = null) {
  return {
    ok: estado >= 200 && estado < 300,
    status: estado,
    text: vi.fn().mockResolvedValue(
      cuerpo === null
        ? ""
        : typeof cuerpo === "string"
          ? cuerpo
          : JSON.stringify(cuerpo),
    ),
  };
}

function opcionesEnviadas() {
  return fetch.mock.calls[0][1];
}

describe("clienteHttp", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("realiza una peticion GET y procesa la respuesta JSON", async () => {
    fetch.mockResolvedValue(crearRespuesta(200, [{ id: 1, nombre: "Martillo" }]));

    const resultado = await clienteHttp.get("http://localhost:8085", "/api/productos");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8085/api/productos",
      expect.objectContaining({ method: "GET" }),
    );
    expect(resultado).toEqual([{ id: 1, nombre: "Martillo" }]);
  });

  it("realiza una peticion POST con cuerpo JSON", async () => {
    const datos = { nombre: "Taladro", precio: 39990 };
    fetch.mockResolvedValue(crearRespuesta(201, { id: 10, ...datos }));

    await clienteHttp.post("http://localhost:8085", "api/productos", datos);

    expect(opcionesEnviadas().method).toBe("POST");
    expect(opcionesEnviadas().body).toBe(JSON.stringify(datos));
    expect(opcionesEnviadas().headers.get("Content-Type")).toBe("application/json");
  });

  it("envía PUT con JSON y los encabezados indicados y devuelve la respuesta", async () => {
    const datos = { nombre: "Taladro actualizado" };
    const respuesta = { id: 10, ...datos };
    fetch.mockResolvedValue(crearRespuesta(200, respuesta));

    const resultado = await clienteHttp.put("http://localhost:8085", "/api/productos/10", datos, {
      token: "jwt-de-prueba",
      encabezados: { Accept: "application/json" },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8085/api/productos/10",
      expect.objectContaining({ method: "PUT", body: JSON.stringify(datos) }),
    );
    expect(opcionesEnviadas().headers.get("Content-Type")).toBe("application/json");
    expect(opcionesEnviadas().headers.get("Authorization")).toBe("Bearer jwt-de-prueba");
    expect(opcionesEnviadas().headers.get("Accept")).toBe("application/json");
    expect(resultado).toEqual(respuesta);
  });

  it("realiza una peticion DELETE sin agregar cuerpo", async () => {
    fetch.mockResolvedValue(crearRespuesta(204));

    await clienteHttp.delete("http://localhost:8085", "/api/productos/10");

    expect(opcionesEnviadas().method).toBe("DELETE");
    expect(opcionesEnviadas()).not.toHaveProperty("body");
  });

  it("incluye Authorization Bearer cuando recibe un token", async () => {
    fetch.mockResolvedValue(crearRespuesta(200, []));

    await clienteHttp.get("http://localhost:8085", "/api/productos", {
      token: "jwt-de-prueba",
    });

    expect(opcionesEnviadas().headers.get("Authorization")).toBe(
      "Bearer jwt-de-prueba",
    );
  });

  it("no incluye Authorization cuando no recibe un token", async () => {
    fetch.mockResolvedValue(crearRespuesta(200, []));

    await clienteHttp.get("http://localhost:8085", "/api/productos");

    expect(opcionesEnviadas().headers.has("Authorization")).toBe(false);
  });

  it("retorna null para una respuesta HTTP 204", async () => {
    fetch.mockResolvedValue(crearRespuesta(204));

    await expect(
      clienteHttp.delete("http://localhost:8085", "/api/productos/10"),
    ).resolves.toBeNull();
  });

  it.each([
    [400, "DATOS_INVALIDOS"],
    [404, "NO_ENCONTRADO"],
    [409, "CONFLICTO"],
    [500, "ERROR_SERVIDOR"],
  ])("diferencia el error HTTP %s", async (estado, codigo) => {
    fetch.mockResolvedValue(crearRespuesta(estado));

    await expect(clienteHttp.get("http://localhost:8085", "/recurso")).rejects.toMatchObject({
      name: "ErrorHttp",
      estado,
      codigo,
    });
  });

  it("diferencia los errores 401 y 403", async () => {
    fetch
      .mockResolvedValueOnce(crearRespuesta(401))
      .mockResolvedValueOnce(crearRespuesta(403));

    await expect(clienteHttp.get("http://localhost:8081", "/privado")).rejects.toMatchObject({
      estado: 401,
      codigo: "NO_AUTENTICADO",
    });
    await expect(clienteHttp.get("http://localhost:8081", "/admin")).rejects.toMatchObject({
      estado: 403,
      codigo: "SIN_PERMISOS",
    });
  });

  it("conserva un mensaje de error entregado por el backend", async () => {
    fetch.mockResolvedValue(
      crearRespuesta(400, { mensaje: "El correo ya se encuentra registrado." }),
    );

    await expect(clienteHttp.post("http://localhost:8081", "/registro", {})).rejects.toThrow(
      "El correo ya se encuentra registrado.",
    );
  });

  it("maneja respuestas de error sin JSON valido", async () => {
    fetch.mockResolvedValue(crearRespuesta(500, "Servicio temporalmente no disponible"));

    await expect(clienteHttp.get("http://localhost:8085", "/api/productos")).rejects.toMatchObject({
      message: "Servicio temporalmente no disponible",
      datos: "Servicio temporalmente no disponible",
    });
  });

  it("convierte un error de red en un error de conexion identificable", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(clienteHttp.get("http://localhost:8085", "/api/productos")).rejects.toEqual(
      expect.objectContaining({
        name: "ErrorHttp",
        estado: 0,
        codigo: "ERROR_CONEXION",
      }),
    );
  });

  it.each([undefined, " ", "localhost:8085", "http://localhost:abc", "//example.test"])(
    "clasifica la URL base %s como error de configuración antes de llamar a fetch",
    async (urlBase) => {
      await expect(clienteHttp.get(urlBase, "/api/productos")).rejects.toMatchObject({
        name: "ErrorHttp",
        estado: 0,
        codigo: "ERROR_CONFIGURACION",
      });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it.each([200, 500])("conserva el estado %s si falla la lectura del cuerpo", async (estado) => {
    const causa = new TypeError("Se interrumpió la lectura");
    const respuesta = crearRespuesta(estado);
    respuesta.text.mockRejectedValue(causa);
    fetch.mockResolvedValue(respuesta);

    await expect(clienteHttp.get("http://localhost:8085", "/api/productos")).rejects.toMatchObject({
      name: "ErrorHttp",
      estado,
      codigo: "ERROR_LECTURA_RESPUESTA",
      cause: causa,
    });
  });

  it("construye URLs sin duplicar barras", () => {
    expect(construirUrl("http://localhost:8085/", "/api/productos")).toBe(
      "http://localhost:8085/api/productos",
    );
    expect(construirUrl("/api/product-service/", "/productos/1")).toBe(
      "/api/product-service/productos/1",
    );
  });

  it("expone los errores HTTP mediante la clase ErrorHttp", async () => {
    fetch.mockResolvedValue(crearRespuesta(404));

    await expect(clienteHttp.get("http://localhost:8085", "/inexistente")).rejects.toBeInstanceOf(
      ErrorHttp,
    );
  });
});
