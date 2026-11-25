// src/pages/admin/AdminProductos.spec.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProductos from "./AdminProductos";

// Mock canónico de react-router-dom según Guía 14
vi.mock("react-router-dom", () => ({
  Link: ({ children, to, className, title }) => (
    <a href={to} className={className} title={title}>{children}</a>
  ),
  NavLink: ({ children, to, className }) => (
    <a href={to} className={typeof className === "function" ? className({ isActive: false }) : className}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

// Mock del FormularioProducto para invocar onGuardar y onCancelarEdicion directamente
vi.mock("./FormularioProducto", () => ({
  default: ({ onGuardar, productoAEditar, onCancelarEdicion }) => (
    <div data-testid="formulario-mock">
      <button
        type="button"
        onClick={() =>
          onGuardar(
            productoAEditar || {
              id: 99,
              nombre: "Huincha Nueva 5M",
              categoria: "Herramientas Manuales",
              precio: 3990,
              stock: 10,
              descripcion: "Cinta métrica",
            }
          )
        }
      >
        {productoAEditar ? "Actualizar Producto" : "Guardar Producto"}
      </button>
      {productoAEditar && (
        <button type="button" onClick={onCancelarEdicion}>
          Cancelar
        </button>
      )}
    </div>
  ),
}));

describe("AdminProductos", () => {
  const productosPrueba = [
    { id: 1, nombre: "Martillo Galponero", categoria: "Herramientas Manuales", precio: 9990, stock: 12, descripcion: "Mango de fibra" },
    { id: 2, nombre: "Taladro Percutor 20V", categoria: "Herramientas Eléctricas", precio: 59990, stock: 3 },
    { id: 3, nombre: "Sierra Circular", categoria: "Herramientas Eléctricas", precio: 68990, stock: 2, descripcion: "Corte madera" },
  ];

  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it("renderiza la tabla con los productos entregados", () => {
    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);
    expect(screen.getByText("Martillo Galponero")).toBeInTheDocument();
    expect(screen.getByText("Taladro Percutor 20V")).toBeInTheDocument();
  });

  it("calcula y exhibe la cantidad de artículos con stock crítico (stock <= 5)", () => {
    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);
    const badgeCritico = screen.getAllByText("Crítico");
    expect(badgeCritico).toHaveLength(2);
  });

  it("filtra productos en la tabla al escribir en el buscador por nombre", async () => {
    const usuario = userEvent.setup();
    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "Martillo");

    expect(screen.getByText("Martillo Galponero")).toBeInTheDocument();
    expect(screen.queryByText("Taladro Percutor 20V")).not.toBeInTheDocument();
  });

  it("filtra productos por categoría al escribir el nombre de la categoría", async () => {
    const usuario = userEvent.setup();
    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "Manuales");

    expect(screen.getByText("Martillo Galponero")).toBeInTheDocument();
    expect(screen.queryByText("Sierra Circular")).not.toBeInTheDocument();
  });

  it("muestra mensaje de búsqueda sin resultados", async () => {
    const usuario = userEvent.setup();
    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "ArticuloInexistenteXYZ");

    expect(screen.getByText(/no se encontraron productos coincidentes/i)).toBeInTheDocument();
  });

  it("elimina un producto si el usuario confirma el diálogo", async () => {
    const usuario = userEvent.setup();
    const setProductosMock = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminProductos productos={productosPrueba} setProductos={setProductosMock} />);

    const botonesEliminar = screen.getAllByTitle("Eliminar producto");
    await usuario.click(botonesEliminar[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(setProductosMock).toHaveBeenCalled();
  });

  it("cancela la eliminación si el usuario presiona Cancelar", async () => {
    const usuario = userEvent.setup();
    const setProductosMock = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<AdminProductos productos={productosPrueba} setProductos={setProductosMock} />);

    const botonesEliminar = screen.getAllByTitle("Eliminar producto");
    await usuario.click(botonesEliminar[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(setProductosMock).not.toHaveBeenCalled();
  });

  it("muestra la ficha técnica cubriendo con y sin descripción adicional (Línea 54)", async () => {
    const usuario = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);

    const botonesDetalle = screen.getAllByTitle("Consultar ficha");

    // 1. Con descripción (id 1)
    await usuario.click(botonesDetalle[0]);
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Mango de fibra"));

    // 2. Sin descripción (id 2) -> cubre prod.descripcion || "Sin descripción adicional"
    await usuario.click(botonesDetalle[1]);
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Sin descripción adicional"));
  });

  it("carga los datos en el formulario al pulsar Editar y cancela la edición", async () => {
    const usuario = userEvent.setup();
    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);

    const botonesEditar = screen.getAllByTitle("Editar producto");
    await usuario.click(botonesEditar[0]);

    expect(screen.getByText("Editar Producto: Martillo Galponero")).toBeInTheDocument();

    const botonCancelar = screen.getByRole("button", { name: /cancelar/i });
    await usuario.click(botonCancelar);

    expect(screen.queryByText("Editar Producto: Martillo Galponero")).not.toBeInTheDocument();
  });

  it("actualiza un producto existente y permite cerrar la alerta de éxito", async () => {
    const usuario = userEvent.setup();
    let callbackActualizador;
    const setProductosMock = vi.fn((cb) => {
      if (typeof cb === "function") callbackActualizador = cb;
    });

    render(<AdminProductos productos={productosPrueba} setProductos={setProductosMock} />);

    // Iniciar edición
    const botonesEditar = screen.getAllByTitle("Editar producto");
    await usuario.click(botonesEditar[0]);

    // Guardar actualización
    const botonActualizar = screen.getByRole("button", { name: /actualizar producto/i });
    await usuario.click(botonActualizar);

    expect(setProductosMock).toHaveBeenCalled();

    if (callbackActualizador) {
      const listaActualizada = callbackActualizador(productosPrueba);
      expect(listaActualizada).toHaveLength(3);
    }

    // Cerrar la alerta
    const alerta = screen.getByText(/actualizado con éxito/i);
    expect(alerta).toBeInTheDocument();

    const botonCerrarAlerta = screen.getByLabelText("Cerrar");
    await usuario.click(botonCerrarAlerta);
    expect(screen.queryByText(/actualizado con éxito/i)).not.toBeInTheDocument();
  });

  it("registra un producto nuevo cuando no se está editando (Líneas 23-24)", async () => {
    const usuario = userEvent.setup();
    let callbackActualizador;
    const setProductosMock = vi.fn((cb) => {
      if (typeof cb === "function") callbackActualizador = cb;
    });

    render(<AdminProductos productos={productosPrueba} setProductos={setProductosMock} />);

    // El botón del formulario muestra "Guardar Producto" cuando productoAEditar es null
    const botonGuardar = screen.getByRole("button", { name: /guardar producto/i });
    await usuario.click(botonGuardar);

    expect(setProductosMock).toHaveBeenCalled();

    // Ejecuta la rama funcional de las líneas 23-24: anteriores => [...anteriores, producto]
    if (callbackActualizador) {
      const listaNueva = callbackActualizador(productosPrueba);
      expect(listaNueva).toHaveLength(4);
      expect(listaNueva[3].nombre).toBe("Huincha Nueva 5M");
    }

    expect(screen.getByText(/registrado con éxito/i)).toBeInTheDocument();
  });

  it("elimina el producto que estaba seleccionado en edición y limpia el formulario", async () => {
    const usuario = userEvent.setup();
    let callbackActualizador;
    const setProductosMock = vi.fn((cb) => {
      if (typeof cb === "function") callbackActualizador = cb;
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminProductos productos={productosPrueba} setProductos={setProductosMock} />);

    // Modo edición
    const botonesEditar = screen.getAllByTitle("Editar producto");
    await usuario.click(botonesEditar[0]);
    expect(screen.getByText("Editar Producto: Martillo Galponero")).toBeInTheDocument();

    // Eliminar el mismo producto activo
    const botonesEliminar = screen.getAllByTitle("Eliminar producto");
    await usuario.click(botonesEliminar[0]);

    if (callbackActualizador) {
      const listaTrasEliminar = callbackActualizador(productosPrueba);
      expect(listaTrasEliminar).toHaveLength(2);
    }

    expect(screen.queryByText("Editar Producto: Martillo Galponero")).not.toBeInTheDocument();
    expect(screen.getByText("Producto eliminado correctamente.")).toBeInTheDocument();
  });

  it("oculta los controles de edición y eliminación si el usuario tiene rol 'Vendedor'", () => {
    localStorage.setItem("usuario_sesion", JSON.stringify({ rol: "Vendedor" }));
    render(<AdminProductos productos={productosPrueba} setProductos={() => { }} />);

    expect(screen.queryByTitle("Editar producto")).not.toBeInTheDocument();
    const badgesSoloLectura = screen.getAllByText("Solo lectura");
    expect(badgesSoloLectura.length).toBeGreaterThan(0);
    expect(screen.getByText("Vista de consulta para equipo de ventas.")).toBeInTheDocument();
  });
});