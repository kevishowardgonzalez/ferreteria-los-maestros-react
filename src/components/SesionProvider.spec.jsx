import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SesionProvider, { useSesion } from "./SesionProvider";
import RutaProtegida from "./RutaProtegida";
import { guardarSesion } from "../utils/persistencia";
import { authDePrueba, tokenDePrueba } from "../test/sesion";

function guardarUsuario(rol, token) {
  const { token: jwt, ...usuario } = authDePrueba(rol, token);
  guardarSesion({ token: jwt, usuario });
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
    guardarUsuario("ADMIN", vigente);
    const fetchAuth = vi.fn().mockResolvedValue(Response.json(authDePrueba("ADMIN", nuevo)));
    vi.stubGlobal("fetch", fetchAuth);
    montar();

    await act(async () => vi.advanceTimersByTimeAsync(61_000));

    const [url, opciones] = fetchAuth.mock.calls[0];
    expect(url).toBe("http://localhost:8081/api/v1/auth/refresh");
    expect(opciones.method).toBe("POST");
    expect(opciones.headers.get("Authorization")).toBe(`Bearer ${vigente}`);
    expect(opciones.body).toBeUndefined();
    expect(JSON.parse(sessionStorage.getItem("usuario_sesion")).token).toBe(nuevo);
  });

  it("cierra la sesión si falla la conexión durante la renovación y el JWT vence", async () => {
    vi.useFakeTimers();
    guardarUsuario("ADMIN", tokenDePrueba(120));
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    montar();

    await act(async () => vi.advanceTimersByTimeAsync(121_000));

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(sessionStorage.getItem("usuario_sesion")).toBeNull();
  });
});
