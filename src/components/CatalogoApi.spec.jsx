import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, it, expect, vi } from "vitest";
import App from "../App";

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const herramienta = { id: 20, nombre: "Alicate API", categoria: "Manuales", precio: 2700, stock: 3 };
const cemento = { id: 21, nombre: "Cemento API", categoria: "Obra", precio: 5100, stock: 12 };
const categorias = [
  { id: 10, nombre: "Manuales", descripcion: "", activo: true },
  { id: 11, nombre: "Obra", descripcion: "", activo: true },
];

it("carga el catálogo y filtra por las categorías activas de la API", async () => {
  let responder;
  vi.stubGlobal("fetch", vi.fn((url) => url.endsWith("/activas")
    ? Promise.resolve(Response.json(categorias))
    : new Promise((resolve) => { responder = resolve; })));
  render(<MemoryRouter initialEntries={["/productos"]}><App /></MemoryRouter>);
  expect(screen.getByRole("status")).toHaveTextContent("Cargando productos");
  responder(Response.json([herramienta, cemento]));
  await screen.findByText("Cemento API");
  const filtro = screen.getByLabelText("Filtrar por categoría");
  await userEvent.selectOptions(filtro, "Manuales");
  expect(screen.getByText("Alicate API")).toBeInTheDocument();
  expect(screen.queryByText("Cemento API")).not.toBeInTheDocument();
});

it("muestra el error de conexión y no carga datos locales", async () => {
  vi.stubGlobal("fetch", vi.fn((url) => url.endsWith("/activas")
    ? Promise.resolve(Response.json([]))
    : Promise.reject(new TypeError("Error de red"))));
  render(<MemoryRouter initialEntries={["/productos"]}><App /></MemoryRouter>);
  expect(await screen.findByRole("alert")).toHaveTextContent("No fue posible conectar");
});

it("muestra información real y stock crítico en la vista de solo lectura del vendedor", async () => {
  vi.stubGlobal("fetch", vi.fn((url) => Promise.resolve(Response.json(
    url.endsWith("/activas") ? categorias : [herramienta],
  ))));
  render(<MemoryRouter initialEntries={["/vendedor/productos"]}><App /></MemoryRouter>);
  const tabla = screen.getByRole("table");
  expect(await within(tabla).findByText("Alicate API")).toBeInTheDocument();
  expect(within(tabla).getByText("Manuales")).toBeInTheDocument();
  expect(within(tabla).getByText("Crítico")).toBeInTheDocument();
  expect(within(tabla).queryByRole("button")).not.toBeInTheDocument();
});

it("crea, edita y desactiva categorías a través de REST y vuelve a consultar", async () => {
  localStorage.setItem("usuario_sesion", JSON.stringify({ rol: "ADMIN", token: "jwt-de-prueba" }));
  let lista = [];
  const fetchApi = vi.fn(async (url, opciones) => {
    if (url.endsWith("/activas")) return Response.json(lista.filter((item) => item.activo));
    if (url.endsWith("/api/productos")) return Response.json([]);
    if (opciones.method === "GET") return Response.json(lista);
    expect(opciones.headers.get("Authorization")).toBe("Bearer jwt-de-prueba");
    if (opciones.method === "DELETE") {
      lista = lista.map((item) => ({ ...item, activo: false }));
      return new Response(null, { status: 204 });
    }
    lista = [{ id: 12, ...JSON.parse(opciones.body) }];
    return Response.json(lista[0], { status: opciones.method === "POST" ? 201 : 200 });
  });
  vi.stubGlobal("fetch", fetchApi);
  vi.spyOn(window, "confirm").mockReturnValue(true);
  render(<MemoryRouter initialEntries={["/admin/categorias"]}><App /></MemoryRouter>);
  await screen.findByText("No hay categorías.");
  await userEvent.type(screen.getByLabelText("Nombre"), "Fijaciones API");
  await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
  const tabla = screen.getByRole("table");
  await within(tabla).findByText("Fijaciones API");
  await userEvent.click(within(tabla).getByRole("button", { name: "Editar" }));
  const campo = screen.getByLabelText("Nombre");
  await userEvent.clear(campo);
  await userEvent.type(campo, "Fijaciones actualizadas");
  await userEvent.click(screen.getByRole("button", { name: "Guardar" }));
  await within(tabla).findByText("Fijaciones actualizadas");
  await userEvent.click(within(tabla).getByRole("button", { name: "Desactivar" }));
  await within(tabla).findByText("Inactiva");
  expect(fetchApi.mock.calls.filter(([url, o]) => url.endsWith("/api/v1/categorias") && o.method === "GET")).toHaveLength(4);
});
