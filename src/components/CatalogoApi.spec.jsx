import { prepararSesion, respuestaSesion } from "../test/sesion";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, it, expect, vi } from "vitest";
import App from "../App";

afterEach(() => {
  localStorage.clear();
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
  prepararSesion("VENDEDOR");
  render(<MemoryRouter initialEntries={["/vendedor/productos"]}><App /></MemoryRouter>);
  const tabla = screen.getByRole("table");
  expect(await within(tabla).findByText("Alicate API")).toBeInTheDocument();
  expect(within(tabla).getByText("Manuales")).toBeInTheDocument();
  expect(within(tabla).getByText("Crítico")).toBeInTheDocument();
  expect(within(tabla).queryByRole("button")).not.toBeInTheDocument();
});

it("crea, edita y desactiva categorías a través de REST y vuelve a consultar", async () => {
  const { token } = prepararSesion("ADMIN");
  let lista = [];
  const fetchApi = vi.fn(async (url, opciones) => {
    if (url.endsWith("/activas")) return Response.json(lista.filter((item) => item.activo));
    if (url.endsWith("/api/productos")) return Response.json([]);
    expect(opciones.headers.get("Authorization")).toBe("Bearer " + token);
    if (opciones.method === "GET") return Response.json(lista);
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


it("redirige a login al visitante que escribe una URL administrativa", async () => {
  vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
  render(<MemoryRouter initialEntries={["/admin/categorias"]}><App /></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
});

it("redirige al vendedor que intenta entrar al mantenedor de escritura", async () => {
  prepararSesion("VENDEDOR");
  vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
  render(<MemoryRouter initialEntries={["/admin/productos"]}><App /></MemoryRouter>);
  expect(await screen.findByText("Panel de Vendedor")).toBeInTheDocument();
  expect(screen.queryByText("Registrar Nuevo Producto")).not.toBeInTheDocument();
});

it("descarta una sesión vencida, aunque esté guardada", async () => {
  localStorage.setItem("usuario_sesion", JSON.stringify(respuestaSesion("ADMIN", {}, 1)));
  vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
  render(<MemoryRouter initialEntries={["/admin/categorias"]}><App /></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
  expect(localStorage.getItem("usuario_sesion")).toBeNull();
});

it("cierra la sesión local desde el menú del vendedor", async () => {
  prepararSesion("VENDEDOR");
  vi.stubGlobal("fetch", vi.fn(async () => Response.json([])));
  render(<MemoryRouter initialEntries={["/vendedor/productos"]}><App /></MemoryRouter>);
  await userEvent.click(screen.getByRole("link", { name: /cerrar sesión/i }));
  expect(await screen.findByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
  expect(localStorage.getItem("usuario_sesion")).toBeNull();
});

it.each([401, 403])("distingue un HTTP %s en categorías administrativas", async (estado) => {
  prepararSesion("ADMIN");
  vi.stubGlobal("fetch", vi.fn(async (url) => url.endsWith("/api/v1/categorias")
    ? Response.json({ mensaje: "Solicitud rechazada" }, { status: estado })
    : Response.json([])));
  render(<MemoryRouter initialEntries={["/admin/categorias"]}><App /></MemoryRouter>);
  if (estado === 401) {
    expect(await screen.findByRole("heading", { name: "Iniciar Sesión" })).toBeInTheDocument();
    expect(localStorage.getItem("usuario_sesion")).toBeNull();
  } else {
    expect(await screen.findByText("Solicitud rechazada")).toBeInTheDocument();
    expect(localStorage.getItem("usuario_sesion")).not.toBeNull();
  }
});
