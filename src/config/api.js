function normalizarUrlBase(url, puertoLocal) {
  const valor = url?.trim() || `http://localhost:${puertoLocal}`;
  return valor.replace(/\/+$/, "");
}

// Cada valor puede reemplazarse durante la compilacion, por ejemplo con una
// ruta relativa de Nginx en produccion. Los valores locales no contienen rutas
// de endpoints porque sus contratos aun deben confirmarse con el backend.
export const URLS_API = Object.freeze({
  auth: normalizarUrlBase(import.meta.env.VITE_AUTH_API_URL, 8081),
  usuarios: normalizarUrlBase(import.meta.env.VITE_USUARIOS_API_URL, 8082),
  roles: normalizarUrlBase(import.meta.env.VITE_ROLES_API_URL, 8083),
  categorias: normalizarUrlBase(import.meta.env.VITE_CATEGORIAS_API_URL, 8084),
  productos: normalizarUrlBase(import.meta.env.VITE_PRODUCTOS_API_URL, 8085),
  inventario: normalizarUrlBase(import.meta.env.VITE_INVENTARIO_API_URL, 8086),
  boletas: normalizarUrlBase(import.meta.env.VITE_BOLETAS_API_URL, 8087),
  carrito: normalizarUrlBase(import.meta.env.VITE_CARRITO_API_URL, 8088),
  contacto: normalizarUrlBase(import.meta.env.VITE_CONTACTO_API_URL, 8089),
  foro: normalizarUrlBase(import.meta.env.VITE_FORO_API_URL, 8090),
});
