// src/pages/admin/AdminProductos.spec.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminProductos from "./AdminProductos";

describe("8. Módulo Administrativo - AdminProductos", () => {
  const productosPrueba = [
    { id: 1, nombre: "Martillo Galponero", categoria: "Herramientas Manuales", precio: 9990, stock: 12 },
    { id: 2, nombre: "Taladro Percutor 20V", categoria: "Herramientas Eléctricas", precio: 59990, stock: 3 },
    { id: 3, nombre: "Sierra Circular", categoria: "Herramientas Eléctricas", precio: 68990, stock: 2 },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it("renderiza la tabla con los productos entregados", () => {
    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Martillo Galponero")).toBeInTheDocument();
    expect(screen.getByText("Taladro Percutor 20V")).toBeInTheDocument();
  });

  it("calcula y exhibe la cantidad de artículos con stock crítico (stock <= 5)", () => {
    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );
    // Hay 2 artículos con stock <= 5 (Taladro con 3 y Sierra con 2)
    const badgeCritico = screen.getAllByText("Crítico");
    expect(badgeCritico).toHaveLength(2);
  });

  it("filtra productos en la tabla al escribir en el buscador", async () => {
    const usuario = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "Martillo");

    expect(screen.getByText("Martillo Galponero")).toBeInTheDocument();
    expect(screen.queryByText("Taladro Percutor 20V")).not.toBeInTheDocument();
  });

  it("filtra productos por categoría al escribir el nombre de la categoría", async () => {
    const usuario = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "Manuales");

    expect(screen.getByText("Martillo Galponero")).toBeInTheDocument();
    expect(screen.queryByText("Sierra Circular")).not.toBeInTheDocument();
  });

  it("muestra mensaje 'No se encontraron productos coincidentes' en búsquedas sin resultados", async () => {
    const usuario = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "ArticuloInexistenteXYZ");

    expect(screen.getByText(/no se encontraron productos/i)).toBeInTheDocument();
  });

  it("elimina un producto si el usuario confirma el diálogo de confirmación", async () => {
    const usuario = userEvent.setup();
    const setProductosMock = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={setProductosMock} />
      </MemoryRouter>
    );

    const botonesEliminar = screen.getAllByTitle("Eliminar producto");
    await usuario.click(botonesEliminar[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(setProductosMock).toHaveBeenCalled();
  });

  it("cancela la eliminación si el usuario presiona Cancelar en el diálogo", async () => {
    const usuario = userEvent.setup();
    const setProductosMock = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={setProductosMock} />
      </MemoryRouter>
    );

    const botonesEliminar = screen.getAllByTitle("Eliminar producto");
    await usuario.click(botonesEliminar[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(setProductosMock).not.toHaveBeenCalled();
  });

  it("muestra la ficha técnica del producto en un alert al presionar el botón de ver detalle", async () => {
    const usuario = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );

    const botonesDetalle = screen.getAllByTitle("Consultar ficha");
    await usuario.click(botonesDetalle[0]);

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Martillo Galponero"));
  });

  it("carga los datos en el formulario al pulsar el botón Editar", async () => {
    const usuario = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );

    const botonesEditar = screen.getAllByTitle("Editar producto");
    await usuario.click(botonesEditar[0]);

    expect(screen.getByText("Editar Producto: Martillo Galponero")).toBeInTheDocument();
  });

 it("oculta los controles de edición y eliminación si el usuario tiene rol 'Vendedor'", () => {
    localStorage.setItem("usuario_sesion", JSON.stringify({ rol: "Vendedor" }));
    render(
      <MemoryRouter>
        <AdminProductos productos={productosPrueba} setProductos={() => {}} />
      </MemoryRouter>
    );

    expect(screen.queryByTitle("Editar producto")).not.toBeInTheDocument();
    const badgesSoloLectura = screen.getAllByText("Solo lectura");
    expect(badgesSoloLectura.length).toBeGreaterThan(0);
  });
});