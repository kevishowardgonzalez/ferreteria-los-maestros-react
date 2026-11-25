export function tokenDePrueba(venceEnSegundos = 600) {
  const exp = Math.floor(Date.now() / 1000) + venceEnSegundos;
  return `prueba.${btoa(JSON.stringify({ exp })).replace(/=+$/, "")}.firma`;
}

export function authDePrueba(rol = "CLIENTE", token = tokenDePrueba()) {
  return { token, refreshToken: "refresh-de-prueba", id: 1, nombre: "Usuario", apellido: "Prueba", correo: "cuenta@ejemplo.cl", rol };
}
