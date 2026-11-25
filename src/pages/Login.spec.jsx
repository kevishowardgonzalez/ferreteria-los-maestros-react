import { afterEach, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import SesionProvider from "../components/SesionProvider";
import { respuestaSesion } from "../test/sesion";
import { obtenerSesion } from "../utils/persistencia";

afterEach(() => {
  sessionStorage.clear();
  vi.unstubAllGlobals();
});

async function enviar(correo = "parece-admin@example.test") {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <SesionProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<p>Panel administrativo</p>} />
          <Route path="/vendedor/productos" element={<p>Panel vendedor</p>} />
          <Route path="/" element={<p>Tienda pública</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>,
  );
  const usuario = userEvent.setup();
  await usuario.type(screen.getByLabelText("Correo electrónico"), correo);
  await usuario.type(screen.getByLabelText("Contraseña"), "clave123");
  await usuario.click(screen.getByRole("button", { name: "Ingresar" }));
}

it.each([
  ["ADMIN", "Panel administrativo"],
  ["VENDEDOR", "Panel vendedor"],
  ["CLIENTE", "Tienda pública"],
])("envía las credenciales y usa el rol %s devuelto por Auth", async (rol, vista) => {
  const respuesta = respuestaSesion(rol);
  const fetchApi = vi.fn(async () => Response.json(respuesta));
  vi.stubGlobal("fetch", fetchApi);
  await enviar();
  expect(await screen.findByText(vista)).toBeInTheDocument();
  const [[url, solicitud]] = fetchApi.mock.calls;
  expect(new URL(url).pathname).toBe("/api/v1/auth/login");
  expect(solicitud.method).toBe("POST");
  expect(JSON.parse(solicitud.body)).toEqual({ correo: "parece-admin@example.test", password: "clave123" });
  expect(obtenerSesion()).toEqual(respuesta);
  expect(sessionStorage.getItem("usuario_sesion")).not.toContain("clave123");
});

it("muestra el rechazo de credenciales sin crear sesión", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json({}, { status: 401 })));
  await enviar();
  expect(await screen.findByRole("alert")).toHaveTextContent("Correo o contraseña incorrectos");
  expect(obtenerSesion()).toBeNull();
});

it("muestra el fallo de conexión y permite reintentar", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("sin conexión"); }));
  await enviar();
  expect(await screen.findByRole("alert")).toHaveTextContent("No fue posible conectar");
  expect(screen.getByRole("button", { name: "Ingresar" })).toBeEnabled();
});
