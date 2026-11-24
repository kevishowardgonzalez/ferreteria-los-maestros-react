const API_URL = import.meta.env.VITE_CATEGORIAS_API_URL?.replace(/\/+$/, "");

export async function obtenerCategorias(signal) {
  if (!API_URL) {
    throw new Error("Falta configurar VITE_CATEGORIAS_API_URL para cargar las categorías.");
  }

  const respuesta = await fetch(API_URL, { signal });

  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar las categorías (HTTP ${respuesta.status}).`);
  }

  const categorias = await respuesta.json();
  if (!Array.isArray(categorias)) {
    throw new Error("La API devolvió una lista de categorías inválida.");
  }

  return categorias;
}
