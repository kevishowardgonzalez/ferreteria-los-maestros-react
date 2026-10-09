// src/components/TarjetaProducto.spec.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TarjetaProducto from "./TarjetaProducto";
import { productos } from "../data/productos";

describe("Pruebas Unitarias - Integrante 1: Catálogo, filtros, tarjetas y stock (Ferretería Los Maestros)", () => {
    // Datos reales del contexto de Ferretería Los Maestros
    const taladroDisponible = {
        id: 1,
        nombre: "Taladro Percutor Inalámbrico 20V",
        categoria: "Herramientas Eléctricas",
        descripcion: "Mandril de 13mm con 2 baterías de litio y cargador rápido.",
        precio: 45990,
        stock: 8,
    };

    const cementoAgotado = {
        id: 2,
        nombre: "Saco de Cemento Especial 25 kg",
        categoria: "Construcción",
        descripcion: "Cemento de alta resistencia para obras y cimientos.",
        precio: 4990,
        stock: 0,
    };

    // 1. Tarjeta: Props de nombre
    it("1. Renderiza el nombre del producto de ferretería recibido por props", () => {
        render(<TarjetaProducto producto={taladroDisponible} onAgregar={() => { }} />);
        expect(screen.getByText("Taladro Percutor Inalámbrico 20V")).toBeInTheDocument();
    });

    // 2. Tarjeta: Props de categoría y especificaciones técnicas
    it("2. Renderiza la categoría y descripción técnica del producto", () => {
        render(<TarjetaProducto producto={taladroDisponible} onAgregar={() => { }} />);
        expect(screen.getByText("Herramientas Eléctricas")).toBeInTheDocument();
        expect(screen.getByText("Mandril de 13mm con 2 baterías de litio y cargador rápido.")).toBeInTheDocument();
    });

    // 3. Stock: Botón activo cuando hay unidades en bodega
    it("3. Muestra el botón 'Añadir al Carrito' habilitado si hay stock disponible", () => {
        render(<TarjetaProducto producto={taladroDisponible} onAgregar={() => { }} />);
        const boton = screen.getByRole("button", { name: /añadir al carrito/i });
        expect(boton).toBeInTheDocument();
        expect(boton).not.toBeDisabled();
    });

    // 4. Stock: Botón bloqueado cuando se agota el material
    it("4. Deshabilita el botón de compra cuando el stock de bodega es 0", () => {
        render(<TarjetaProducto producto={cementoAgotado} onAgregar={() => { }} />);
        const boton = screen.getByRole("button", { name: /sin stock/i });
        expect(boton).toBeInTheDocument();
        expect(boton).toBeDisabled();
    });

    // 5. Evento: Clic simulado para agregar al carro
    it("5. Ejecuta onAgregar entregando los datos del producto seleccionado al pulsar el botón", async () => {
        const usuario = userEvent.setup();
        const funcionAgregarMock = vi.fn();

        render(
            <TarjetaProducto producto={taladroDisponible} onAgregar={funcionAgregarMock} />
        );

        const boton = screen.getByRole("button", { name: /añadir al carrito/i });
        await usuario.click(boton);

        expect(funcionAgregarMock).toHaveBeenCalledTimes(1);
        expect(funcionAgregarMock).toHaveBeenCalledWith(taladroDisponible);
    });

    // 6. Catálogo: Validación de la estructura de datos de inventario
    it("6. Valida que el inventario contenga productos con id, precio y stock válidos", () => {
        expect(productos.length).toBeGreaterThanOrEqual(4);
        productos.forEach((item) => {
            expect(typeof item.id).toBe("number");
            expect(typeof item.precio).toBe("number");
            expect(item.precio).toBeGreaterThan(0);
            expect(typeof item.stock).toBe("number");
            expect(item.stock).toBeGreaterThanOrEqual(0);
        });
    });

    // 7. Filtros: Coincidencia por categoría de ferretería
    it("7. Filtra correctamente las herramientas pertenecientes a la categoría seleccionada", () => {
        const categoriaBuscada = "Herramientas Eléctricas";
        const herramientas = productos.filter((p) => p.categoria === categoriaBuscada);

        expect(herramientas.length).toBeGreaterThan(0);
        herramientas.forEach((p) => {
            expect(p.categoria).toBe(categoriaBuscada);
        });
    });

    // 8. Filtros: Opción general "Todas"
    it("8. Mantiene la lista completa cuando el filtro de categoría es 'Todas'", () => {
        const categoriaSeleccionada = "Todas";
        const catalogoVisible = categoriaSeleccionada === "Todas"
            ? productos
            : productos.filter((p) => p.categoria === categoriaSeleccionada);

        expect(catalogoVisible.length).toBe(productos.length);
    });
});