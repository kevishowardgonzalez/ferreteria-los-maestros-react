
import { useState } from "react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach
} from "vitest";

import {
  render,
  screen,
  within
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import AdminProductos from "./AdminProductos";

// Simulamos el menú administrativo para aislar las pruebas
vi.mock("./MenuAdmin", () => ({
  default: () => <nav>Menú administrativo simulado</nav>
}));

// Productos utilizados en las pruebas
const productosPrueba = [
  {
    id: 1,
    nombre: "Martillo de prueba",
    categoria: "Herramientas Manuales",
    descripcion: "Martillo de acero",
    precio: 9990,
    stock: 15
  },
  {
    id: 2,
    nombre: "Taladro de prueba",
    categoria: "Herramientas Eléctricas",
    descripcion: "Taladro eléctrico",
    precio: 59990,
    stock: 8
  }
];

describe("Administración de productos", () => {

  // Preparación antes de cada prueba
  beforeEach(() => {
    localStorage.removeItem("usuario_sesion");
  });

  // Restaurar los mocks después de cada prueba
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // PRUEBA 34: FILTRAR PRODUCTOS POR NOMBRE
  // ==========================================

  it("filtra productos por nombre", async () => {
    const usuario = userEvent.setup();

    render(
      <AdminProductos
        productos={productosPrueba}
        setProductos={vi.fn()}
      />
    );

    const tabla = within(screen.getByRole("table"));

    // Comprobar que inicialmente aparecen ambos productos
    expect(
      tabla.getByText("Martillo de prueba")
    ).toBeInTheDocument();

    expect(
      tabla.getByText("Taladro de prueba")
    ).toBeInTheDocument();

    // Buscar el campo de búsqueda
    const buscador = screen.getByPlaceholderText(
      /Buscar por nombre o categoría/i
    );

    // Simular que el usuario escribe
    await usuario.type(buscador, "Martillo");

    // El martillo debe permanecer visible
    expect(
      tabla.getByText("Martillo de prueba")
    ).toBeInTheDocument();

    // El taladro debe desaparecer de los resultados
    expect(
      tabla.queryByText("Taladro de prueba")
    ).not.toBeInTheDocument();
  });

  // ==========================================
  // PRUEBA 35: CONFIRMAR ELIMINACIÓN
  // ==========================================

  it("elimina un producto cuando el administrador confirma", async () => {
    const usuario = userEvent.setup();

    // Simular que el administrador presiona Aceptar
    const confirmar = vi
      .spyOn(window, "confirm")
      .mockReturnValue(true);

    // Componente auxiliar con estado real
    function AdministracionDePrueba() {
      const [productos, setProductos] = useState(productosPrueba);

      return (
        <AdminProductos
          productos={productos}
          setProductos={setProductos}
        />
      );
    }

    render(<AdministracionDePrueba />);

    const tabla = within(screen.getByRole("table"));

    // Comprobar los productos iniciales
    expect(
      tabla.getByText("Martillo de prueba")
    ).toBeInTheDocument();

    expect(
      tabla.getByText("Taladro de prueba")
    ).toBeInTheDocument();

    // Encontrar la fila del martillo
    const filaMartillo = tabla
      .getByText("Martillo de prueba")
      .closest("tr");

    // Presionar el botón Eliminar
    await usuario.click(
      within(filaMartillo).getByTitle("Eliminar producto")
    );

    // Comprobar que se solicitó confirmación
    expect(confirmar).toHaveBeenCalledOnce();

    // El martillo debe desaparecer
    expect(
      tabla.queryByText("Martillo de prueba")
    ).not.toBeInTheDocument();

    // El taladro debe permanecer
    expect(
      tabla.getByText("Taladro de prueba")
    ).toBeInTheDocument();

    // Mostrar confirmación de eliminación exitosa
    expect(
      screen.getByText("Producto eliminado correctamente.")
    ).toBeInTheDocument();
  });

  // ==========================================
  // PRUEBA 36: CANCELAR ELIMINACIÓN
  // ==========================================

  it("mantiene el producto cuando se cancela la eliminación", async () => {
    const usuario = userEvent.setup();

    // Simular que el administrador presiona Cancelar
    const confirmar = vi
      .spyOn(window, "confirm")
      .mockReturnValue(false);

    // Componente auxiliar con estado real
    function AdministracionDePrueba() {
      const [productos, setProductos] = useState(productosPrueba);

      return (
        <AdminProductos
          productos={productos}
          setProductos={setProductos}
        />
      );
    }

    render(<AdministracionDePrueba />);

    const tabla = within(screen.getByRole("table"));

    // Encontrar la fila del martillo
    const filaMartillo = tabla
      .getByText("Martillo de prueba")
      .closest("tr");

    // Intentar eliminar el producto
    await usuario.click(
      within(filaMartillo).getByTitle("Eliminar producto")
    );

    // Comprobar que se solicitó confirmación
    expect(confirmar).toHaveBeenCalledOnce();

    // El martillo debe seguir en el inventario
    expect(
      tabla.getByText("Martillo de prueba")
    ).toBeInTheDocument();

    // El taladro también debe permanecer
    expect(
      tabla.getByText("Taladro de prueba")
    ).toBeInTheDocument();

    // No debe aparecer el mensaje de eliminación
    expect(
      screen.queryByText("Producto eliminado correctamente.")
    ).not.toBeInTheDocument();
  });

});
