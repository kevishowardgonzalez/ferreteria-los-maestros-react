const ERRORES_POR_ESTADO = Object.freeze({
  400: {
    codigo: "DATOS_INVALIDOS",
    mensaje: "Los datos enviados no son validos.",
  },
  401: {
    codigo: "NO_AUTENTICADO",
    mensaje: "La sesion no es valida o ha expirado.",
  },
  403: {
    codigo: "SIN_PERMISOS",
    mensaje: "No tienes permisos para realizar esta operacion.",
  },
  404: {
    codigo: "NO_ENCONTRADO",
    mensaje: "El recurso solicitado no existe.",
  },
  409: {
    codigo: "CONFLICTO",
    mensaje: "La solicitud entra en conflicto con el estado actual.",
  },
  500: {
    codigo: "ERROR_SERVIDOR",
    mensaje: "El servidor no pudo procesar la solicitud.",
  },
});

export class ErrorHttp extends Error {
  constructor(mensaje, { estado = 0, codigo = "ERROR_HTTP", datos = null, causa } = {}) {
    super(mensaje, causa ? { cause: causa } : undefined);
    this.name = "ErrorHttp";
    this.estado = estado;
    this.codigo = codigo;
    this.datos = datos;
  }
}

export function construirUrl(urlBase, ruta = "") {
  const base = typeof urlBase === "string" ? urlBase.trim().replace(/\/+$/, "") : "";

  // Acepta URLs HTTP(S) y prefijos del mismo origen para Nginx.
  const formatoValido = /^(https?:\/\/[^/]|\/(?!\/))/i.test(base) && !/[\\\s?#]/.test(base);
  try {
    if (!formatoValido) throw new TypeError("Formato de URL base inválido.");
    new URL(base, "http://localhost");
  } catch (causa) {
    throw new ErrorHttp("Se requiere una URL base HTTP(S) o una ruta válida del mismo origen.", {
      codigo: "ERROR_CONFIGURACION",
      causa,
    });
  }

  const rutaLimpia = String(ruta).trim();
  if (!rutaLimpia) return base;
  if (rutaLimpia.startsWith("?")) return `${base}${rutaLimpia}`;

  return `${base}/${rutaLimpia.replace(/^\/+/, "")}`;
}

async function leerCuerpo(respuesta) {
  const texto = await respuesta.text();
  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

function obtenerMensaje(datos, mensajePredeterminado) {
  if (typeof datos === "string" && datos.trim()) return datos.trim();

  if (datos && typeof datos === "object") {
    const mensaje = datos.mensaje ?? datos.message ?? datos.error ?? datos.detail;
    if (typeof mensaje === "string" && mensaje.trim()) return mensaje.trim();
  }

  return mensajePredeterminado;
}

export async function solicitar(
  urlBase,
  ruta = "",
  { metodo = "GET", datos, token, encabezados = {} } = {},
) {
  const url = construirUrl(urlBase, ruta);
  const headers = new Headers(encabezados);

  if (datos !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const opciones = { method: metodo, headers };
  if (datos !== undefined) opciones.body = JSON.stringify(datos);

  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch (causa) {
    throw new ErrorHttp("No fue posible conectar con el servidor.", {
      codigo: "ERROR_CONEXION",
      causa,
    });
  }

  if (respuesta.status === 204) return null;

  let cuerpo;
  try {
    cuerpo = await leerCuerpo(respuesta);
  } catch (causa) {
    throw new ErrorHttp("No fue posible leer el cuerpo de la respuesta.", {
      estado: respuesta.status,
      codigo: "ERROR_LECTURA_RESPUESTA",
      causa,
    });
  }

  if (!respuesta.ok) {
    const detalle = ERRORES_POR_ESTADO[respuesta.status] ?? {
      codigo: "ERROR_HTTP",
      mensaje: `La solicitud fallo con el estado HTTP ${respuesta.status}.`,
    };

    throw new ErrorHttp(obtenerMensaje(cuerpo, detalle.mensaje), {
      estado: respuesta.status,
      codigo: detalle.codigo,
      datos: cuerpo,
    });
  }

  return cuerpo;
}

export const clienteHttp = Object.freeze({
  get(urlBase, ruta, opciones = {}) {
    return solicitar(urlBase, ruta, { ...opciones, metodo: "GET" });
  },

  post(urlBase, ruta, datos, opciones = {}) {
    return solicitar(urlBase, ruta, { ...opciones, metodo: "POST", datos });
  },

  put(urlBase, ruta, datos, opciones = {}) {
    return solicitar(urlBase, ruta, { ...opciones, metodo: "PUT", datos });
  },

  delete(urlBase, ruta, opciones = {}) {
    return solicitar(urlBase, ruta, { ...opciones, metodo: "DELETE" });
  },
});
