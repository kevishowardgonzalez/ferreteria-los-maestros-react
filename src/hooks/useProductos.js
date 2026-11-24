
import { useState, useEffect } from "react";
import { obtenerProductos } from "../services/productos";
import { obtenerCategorias } from "../services/categorias";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorCategorias, setErrorCategorias] = useState("");

  useEffect(() => {
    const controlador = new AbortController();
    const { signal } = controlador;

    async function cargarProductos() {
      try {
        const datos = await obtenerProductos(signal);

        const productosAdaptados = datos.map((producto) => ({
          ...producto,
          categoria: producto.categoria?.nombre ?? producto.categoria ?? "",
        }));

        if (!signal.aborted) setProductos(productosAdaptados);
      } catch (error) {
        if (!signal.aborted) setError(error.message);
      } finally {
        if (!signal.aborted) setCargando(false);
      }
    }

    async function cargarCategorias() {
      try {
        const datos = await obtenerCategorias(signal);
        if (!signal.aborted) setCategorias(datos);
      } catch (error) {
        if (!signal.aborted) setErrorCategorias(`No se pudo cargar el filtro de categorías. ${error.message}`);
      }
    }

    cargarProductos();
    cargarCategorias();
    return () => controlador.abort();
  }, []);

  const visibles =
    categoria === "Todas"
      ? productos
      : productos.filter((prod) => prod.categoria === categoria);

  return {
    productos,
    setProductos,
    categorias,
    categoria,
    setCategoria,
    visibles,
    cargando,
    error,
    errorCategorias,
  };
}
