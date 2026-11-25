import { afterEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Registro from "./Registro";
import SesionProvider from "../components/SesionProvider";
import { respuestaSesion } from "../test/sesion";
import { obtenerSesion } from "../utils/persistencia";

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  vi.unstubAllGlobals();
});

async function enviarRegistro() {
  render(
    <MemoryRouter initialEntries={["/registro"]}>
      <SesionProvider>
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<p>Tienda pública</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  );
  const usuario = userEvent.setup();
  for (const [campo, valor] of Object.entries({
    RUN: "11222333-4", Nombre: "Ana", Apellido: "Prueba",
    "Correo electrónico": "ana@example.test", Contraseña: "clave123",
  })) {
    await usuario.type(screen.getByLabelText(campo), valor);
  }
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  await usuario.click(screen.getByRole("button", { name: "Registrarse" }));
}

it("registra un cliente en Auth con RUN y guarda su sesión", async () => {
  const respuesta = respuestaSesion();
  const fetchApi = vi.fn(async () => Response.json(respuesta, { status: 201 }));
  vi.stubGlobal("fetch", fetchApi);
  await enviarRegistro();
  expect(await screen.findByText("Tienda pública")).toBeInTheDocument();
  const [[url, solicitud]] = fetchApi.mock.calls;
  expect(new URL(url).pathname).toBe("/api/v1/auth/register");
  expect(JSON.parse(solicitud.body)).toEqual({
    run: "11222333-4", nombre: "Ana", apellido: "Prueba", correo: "ana@example.test", password: "clave123",
  });
  expect(obtenerSesion()).toEqual(respuesta);
  expect(localStorage.getItem("usuarios_sistema")).toBeNull();
});

it("muestra un rechazo de Auth y conserva el formulario", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({ mensaje: "El RUN ya está registrado" }, { status: 400 })));
  await enviarRegistro();
  expect(await screen.findByRole("alert")).toHaveTextContent("El RUN ya está registrado");
  expect(screen.getByLabelText("RUN")).toHaveValue("11222333-4");
  expect(obtenerSesion()).toBeNull();
});

it("rechaza una respuesta de registro con privilegios", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json(respuestaSesion("ADMIN"), { status: 201 })));
  await enviarRegistro();
  expect(await screen.findByRole("alert")).toHaveTextContent("rol inválido");
  expect(obtenerSesion()).toBeNull();
});
