import SesionProvider from "../../components/SesionProvider";
import { prepararSesion } from "../../test/sesion";
// src/pages/admin/AdminProductos.spec.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render as renderReact, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProductos from "./AdminProductos";

// Mock canónico de react-router-dom según Guía 14
const api = vi.hoisted(() => ({
  crearProducto: vi.fn(),
  actualizarProducto: vi.fn(),
  eliminarProducto: vi.fn(),
}));
vi.mock("../../services/productos", () => api);

const inventario = vi.hoisted(() => ({
  listarInventario: vi.fn(), registrarFicha: vi.fn(), consultarExistencias: vi.fn(),
  listarMovimientos: vi.fn(), registrarMovimiento: vi.fn(),
}));
vi.mock("../../services/inventario", () => inventario);

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

function render(componente) {
  return renderReact(<SesionProvider>{componente}</SesionProvider>);
}

let token;

describe("AdminProductos", () => {
  const productosPrueba = [
    { id: 1, nombre: "Martillo Galponero", categoria: "Herramientas Manuales", precio: 9990, stock: 12, descripcion: "Mango de fibra" },
    { id: 2, nombre: "Taladro Percutor 20V", categoria: "Herramientas Eléctricas", precio: 59990, stock: 3 },
    { id: 3, nombre: "Sierra Circular", categoria: "Herramientas Eléctricas", precio: 68990, stock: 2, descripcion: "Corte madera" },
  ];

  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    sessionStorage.clear();
    token = prepararSesion("ADMIN").token;
    vi.resetAllMocks();
    for (const operacion of Object.values(api)) operacion.mockResolvedValue(null);
    api.crearProducto.mockResolvedValue({ id: 99, nombre: "Huincha Nueva 5M" });
    inventario.listarInventario.mockResolvedValue(productosPrueba.map((p) => ({
      productoId: p.id, productoSku: "PROD-" + p.id, stockActual: p.stock, stockMinimo: 5,
    })));
    inventario.registrarFicha.mockResolvedValue({ productoId: 99, stockActual: 10 });
    inventario.listarMovimientos.mockResolvedValue([]);
  });

  it("renderiza la tabla con los productos entregados", () => {
    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);
    expect(within(screen.getByRole("table")).getByText("Martillo Galponero")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getByText("Taladro Percutor 20V")).toBeInTheDocument();
  });

  it("calcula y exhibe la cantidad de artículos con stock crítico (stock <= 5)", async () => {
    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);
    const badgeCritico = await screen.findAllByText("Crítico");
    expect(badgeCritico).toHaveLength(2);
  });

  it("filtra productos en la tabla al escribir en el buscador por nombre", async () => {
    const usuario = userEvent.setup();
    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "Martillo");

    expect(within(screen.getByRole("table")).getByText("Martillo Galponero")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).queryByText("Taladro Percutor 20V")).not.toBeInTheDocument();
  });

  it("filtra productos por categoría al escribir el nombre de la categoría", async () => {
    const usuario = userEvent.setup();
    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "Manuales");

    expect(within(screen.getByRole("table")).getByText("Martillo Galponero")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).queryByText("Sierra Circular")).not.toBeInTheDocument();
  });

  it("muestra mensaje de búsqueda sin resultados", async () => {
    const usuario = userEvent.setup();
    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);

    const inputBuscador = screen.getByPlaceholderText(/buscar por nombre/i);
    await usuario.type(inputBuscador, "ArticuloInexistenteXYZ");

    expect(screen.getByText(/no se encontraron productos coincidentes/i)).toBeInTheDocument();
  });

  it("elimina un producto si el usuario confirma el diálogo", async () => {
    const usuario = userEvent.setup();
    const recargarMock = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminProductos productos={productosPrueba} recargar={recargarMock} />);

    const botonesEliminar = screen.getAllByTitle("Retirar producto");
    await usuario.click(botonesEliminar[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(api.eliminarProducto).toHaveBeenCalledWith(1, token);
    expect(recargarMock).toHaveBeenCalled();
  });

  it("cancela la eliminación si el usuario presiona Cancelar", async () => {
    const usuario = userEvent.setup();
    const recargarMock = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<AdminProductos productos={productosPrueba} recargar={recargarMock} />);

    const botonesEliminar = screen.getAllByTitle("Retirar producto");
    await usuario.click(botonesEliminar[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(recargarMock).not.toHaveBeenCalled();
  });

  it("muestra la ficha técnica cubriendo con y sin descripción adicional (Línea 54)", async () => {
    const usuario = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);

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
    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);

    const botonesEditar = screen.getAllByTitle("Editar producto");
    await usuario.click(botonesEditar[0]);

    expect(screen.getByText("Editar Producto: Martillo Galponero")).toBeInTheDocument();

    const botonCancelar = screen.getByRole("button", { name: /cancelar/i });
    await usuario.click(botonCancelar);

    expect(screen.queryByText("Editar Producto: Martillo Galponero")).not.toBeInTheDocument();
  });

  it("actualiza un producto existente y permite cerrar la alerta de éxito", async () => {
    const usuario = userEvent.setup();
    const recargarMock = vi.fn();

    render(<AdminProductos productos={productosPrueba} recargar={recargarMock} />);

    // Iniciar edición
    const botonesEditar = screen.getAllByTitle("Editar producto");
    await usuario.click(botonesEditar[0]);

    // Guardar actualización
    const botonActualizar = screen.getByRole("button", { name: /actualizar producto/i });
    await usuario.click(botonActualizar);

    expect(api.actualizarProducto).toHaveBeenCalledWith(1, expect.any(Object), token);
    expect(recargarMock).toHaveBeenCalled();


    // Cerrar la alerta
    const alerta = screen.getByText(/información comercial actualizada/i);
    expect(alerta).toBeInTheDocument();

    const botonCerrarAlerta = screen.getByLabelText("Cerrar");
    await usuario.click(botonCerrarAlerta);
    expect(screen.queryByText(/información comercial actualizada/i)).not.toBeInTheDocument();
  });

  it("registra un producto nuevo cuando no se está editando", async () => {
    const usuario = userEvent.setup();
    const recargarMock = vi.fn();

    render(<AdminProductos productos={productosPrueba} recargar={recargarMock} />);

    // El botón del formulario muestra "Guardar Producto" cuando productoAEditar es null
    const botonGuardar = screen.getByRole("button", { name: /guardar producto/i });
    await usuario.click(botonGuardar);

    expect(api.crearProducto).toHaveBeenCalledWith(expect.objectContaining({ nombre: "Huincha Nueva 5M", stock: 0 }), token);
    expect(recargarMock).toHaveBeenCalled();


    expect(inventario.registrarFicha).toHaveBeenCalledWith({ id: 99, nombre: "Huincha Nueva 5M" }, 10, token);
    expect(screen.getByText(/producto e inventario registrados/i)).toBeInTheDocument();
  });

  it("conserva el producto y recupera una ficha tras perder la respuesta", async () => {
    const usuario = userEvent.setup();
    inventario.registrarFicha.mockRejectedValueOnce(Object.assign(new Error("Sin conexión"), { estado: 0 }));
    inventario.consultarExistencias.mockResolvedValueOnce({ productoId: 99, stockActual: 10 });
    render(<AdminProductos productos={productosPrueba} recargar={vi.fn()} />);

    await usuario.click(screen.getByRole("button", { name: "Guardar Producto" }));
    expect(await screen.findByText("Producto registrado y ficha recuperada.")).toBeInTheDocument();
    expect(api.crearProducto).toHaveBeenCalledTimes(1);
    expect(inventario.consultarExistencias).toHaveBeenCalledWith(99);
  });

  it("indica el producto existente cuando el alta de inventario queda pendiente", async () => {
    const usuario = userEvent.setup();
    inventario.registrarFicha.mockRejectedValueOnce(new Error("Inventario no disponible"));
    inventario.consultarExistencias.mockRejectedValueOnce(Object.assign(new Error("Sin ficha"), { estado: 404 }));
    render(<AdminProductos productos={productosPrueba} recargar={vi.fn()} />);

    await usuario.click(screen.getByRole("button", { name: "Guardar Producto" }));
    expect(await screen.findByText(/Producto #99 creado con inventario pendiente/)).toBeInTheDocument();
    expect(api.crearProducto).toHaveBeenCalledTimes(1);
  });

  it("elimina el producto que estaba seleccionado en edición y limpia el formulario", async () => {
    const usuario = userEvent.setup();
    const recargarMock = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<AdminProductos productos={productosPrueba} recargar={recargarMock} />);

    // Modo edición
    const botonesEditar = screen.getAllByTitle("Editar producto");
    await usuario.click(botonesEditar[0]);
    expect(screen.getByText("Editar Producto: Martillo Galponero")).toBeInTheDocument();

    // Eliminar el mismo producto activo
    const botonesEliminar = screen.getAllByTitle("Retirar producto");
    await usuario.click(botonesEliminar[0]);


    expect(screen.queryByText("Editar Producto: Martillo Galponero")).not.toBeInTheDocument();
    expect(screen.getByText("Producto retirado del catálogo.")).toBeInTheDocument();
  });

  it("oculta los controles de edición y eliminación si el usuario tiene rol 'Vendedor'", () => {
    prepararSesion("VENDEDOR");
    render(<AdminProductos productos={productosPrueba} recargar={() => { }} />);

    expect(screen.queryByTitle("Editar producto")).not.toBeInTheDocument();
    const badgesSoloLectura = screen.getAllByText("Solo lectura");
    expect(badgesSoloLectura.length).toBeGreaterThan(0);
    expect(screen.getByText("Vista de consulta para equipo de ventas.")).toBeInTheDocument();
  });
});