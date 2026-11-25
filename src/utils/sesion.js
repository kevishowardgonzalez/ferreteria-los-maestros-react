export const destinosPorRol = Object.freeze({
  ADMIN: "/admin",
  VENDEDOR: "/vendedor/productos",
  CLIENTE: "/",
});

export function vencimientoToken(token) {
  try {
    const partes = token.split(".");
    if (partes.length !== 3 || partes.some((parte) => !parte)) return 0;
    const contenido = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(contenido));
    return Number.isFinite(exp) ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function sesionVigente(usuario) {
  return Object.hasOwn(destinosPorRol, usuario?.rol)
    && typeof usuario.correo === "string" && Boolean(usuario.correo.trim())
    && vencimientoToken(usuario.token) > Date.now();
}
