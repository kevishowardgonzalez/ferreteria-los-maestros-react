import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SesionProvider, { useSesion } from "./SesionProvider";
import RutaProtegida from "./RutaProtegida";
import { guardarSesion } from "../utils/persistencia";
import { encabezadosAutorizados } from "../services/encabezadosAutorizados";
import { authDePrueba, tokenDePrueba } from "../test/sesion";

function guardarUsuario(rol, token, renovable = false) {
  const { token: jwt, refreshToken, ...usuario } = authDePrueba(rol, token);
  guardarSesion({ token: jwt, usuario, refreshToken: renovable ? refreshToken : undefined });
}

function Panel() {
  const { cerrarSesion } = useSesion();
  return <button onClick={cerrarSesion}>Cerrar sesión</button>;
}

function montar() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <SesionProvider>
        <Routes>
          <Route path="/" element={<h1>Tienda</h1>} />
          <Route path="/login" element={<h1>Login</h1>} />
          <Route element={<RutaProtegida rol="ADMIN" />}>
            <Route path="/admin" element={<Panel />} />
          </Route>
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  );
}

describe("Sesión y acceso", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.stubEnv("VITE_AUTH_API_URL", "http://localhost:8081/api");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("descarta una sesión vencida y redirige a login", () => {
    guardarUsuario("ADMIN", tokenDePrueba(-60));
    montar();
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
  });

  it("usa solo el JWT de acceso como Bearer y rechaza uno vencido", () => {
    const acceso = tokenDePrueba();
    guardarUsuario("CLIENTE", acceso, true);
    expect(encabezadosAutorizados().get("Authorization")).toBe(`Bearer ${acceso}`);
    guardarUsuario("CLIENTE", tokenDePrueba(-60), true);
    expect(() => encabezadosAutorizados()).toThrow();
  });

  it.each(["CLIENTE", "VENDEDOR"])("impide que %s ingrese al panel ADMIN", (rol) => {
    guardarUsuario(rol);
    montar();
    expect(screen.getByRole("heading", { name: "Tienda" })).toBeInTheDocument();
  });

  it("restaura la sesión al montar y la elimina al salir", async () => {
    guardarUsuario("ADMIN");
    montar();
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
  });

  it("envía Bearer sin cuerpo al renovar y guarda el JWT actualizado", async () => {
    vi.useFakeTimers();
    const vigente = tokenDePrueba(120);
    const nuevo = tokenDePrueba(600);
    guardarUsuario("ADMIN", vigente, true);
    const fetchAuth = vi.fn().mockResolvedValue(Response.json({ ...authDePrueba("ADMIN", nuevo), refreshToken: "refresh-rotado" }));
    vi.stubGlobal("fetch", fetchAuth);
    montar();

    await act(async () => vi.advanceTimersByTimeAsync(61_000));

    const [url, opciones] = fetchAuth.mock.calls[0];
    expect(url).toBe("http://localhost:8081/api/v1/auth/refresh");
    expect(opciones.method).toBe("POST");
    expect(opciones.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(opciones.body)).toEqual({ refreshToken: "refresh-de-prueba" });
    expect(JSON.parse(sessionStorage.getItem("usuario_sesion")).refreshToken).toBe("refresh-rotado");
    expect(JSON.parse(sessionStorage.getItem("usuario_sesion")).token).toBe(nuevo);
  });

  it("restaura con el refresh token cuando el acceso ya vencio", async () => {
    vi.useFakeTimers();
    guardarUsuario("ADMIN", tokenDePrueba(-1), true);
    const fetchAuth = vi.fn().mockResolvedValue(Response.json(authDePrueba("ADMIN")));
    vi.stubGlobal("fetch", fetchAuth);
    montar();

    expect(screen.getByRole("status")).toHaveTextContent("Restaurando sesión");
    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it.each([401, 403])("limpia la sesion si Auth rechaza la renovacion (%s)", async (status) => {
    vi.useFakeTimers();
    guardarUsuario("ADMIN", tokenDePrueba(-1), true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: "Rechazado" }, { status })));
    montar();

    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
  });

  it("revoca la renovacion al cerrar sesion", async () => {
    guardarUsuario("ADMIN", tokenDePrueba(), true);
    const fetchAuth = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchAuth);
    montar();

    await userEvent.click(screen.getByRole("button"));
    expect(fetchAuth).toHaveBeenCalledWith("http://localhost:8081/api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: "refresh-de-prueba" }),
      signal: expect.any(AbortSignal),
    });
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("mantiene el cierre local e informa si Auth no confirma la revocación", async () => {
    guardarUsuario("ADMIN", tokenDePrueba(), true);
    let rechazarLogout;
    vi.stubGlobal("fetch", vi.fn(() => new Promise((_, reject) => {
      rechazarLogout = reject;
    })));
    montar();

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Confirmando la revocación");
    await act(async () => rechazarLogout(new TypeError("Sin conexión")));
    expect(screen.getByRole("status")).toHaveTextContent("No se pudo confirmar la revocación");
  });

  it("conserva el acceso vigente si Auth señala una renovación duplicada", async () => {
    vi.useFakeTimers();
    guardarUsuario("ADMIN", tokenDePrueba(120), true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({}, { status: 409 })));
    montar();

    await act(async () => vi.advanceTimersByTimeAsync(61_000));
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(sessionStorage.getItem("usuario_sesion")).not.toBeNull();
  });

  it("cierra la sesión si falla la conexión durante la renovación y el JWT vence", async () => {
    vi.useFakeTimers();
    guardarUsuario("ADMIN", tokenDePrueba(120), true);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    montar();

    await act(async () => vi.advanceTimersByTimeAsync(121_000));

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
  });
});
