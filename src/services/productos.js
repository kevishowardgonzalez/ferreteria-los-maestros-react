
const API_URL = import.meta.env.VITE_PRODUCTOS_API_URL?.replace(/\/+$/, "");

export async function obtenerProductos(signal) {
  if (!API_URL) {
    throw new Error("Falta configurar VITE_PRODUCTOS_API_URL para cargar el catálogo.");
  }

  const respuesta = await fetch(API_URL, { signal });

  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los productos (HTTP ${respuesta.status}).`);
  }

  const productos = await respuesta.json();
  if (!Array.isArray(productos)) {
    throw new Error("La API devolvió un catálogo de productos inválido.");
  }

  return productos;
}
