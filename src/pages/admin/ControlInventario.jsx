import { useEffect, useState } from "react";
import { buscarProducto } from "../../services/productos";
import { consultarExistencias, listarMovimientos, registrarFicha, registrarMovimiento } from "../../services/inventario";
import { textoExistencias } from "../../utils/existencias";

export default function ControlInventario({ productos, fichas, estado, token, recargar, rechazarCredencial }) {
  const [seleccion, setSeleccion] = useState("");
  const [tipo, setTipo] = useState("ENTRADA");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [historial, setHistorial] = useState(null);
  const [revision, setRevision] = useState(0);
  const [noListados, setNoListados] = useState({});
  const producto = productos.find((p) => String(p.id) === seleccion);
  const ficha = fichas?.find((f) => f.productoId === producto?.id);

  useEffect(() => {
    if (!fichas || !token) return;
    let vigente = true;
    const ids = new Set(productos.map((p) => p.id));
    Promise.all(fichas.filter((f) => !ids.has(f.productoId)).map(async (f) => {
      try {
        const p = await buscarProducto(f.productoId);
        return [f.productoId, p.retirado ? "Producto retirado" : "Producto fuera del listado"];
      } catch (error) {
        return [f.productoId, error.estado === 404 ? "Ficha sin producto" : "Existencia del producto sin verificar"];
      }
    })).then((resultados) => { if (vigente) setNoListados(Object.fromEntries(resultados)); });
    return () => { vigente = false; };
  }, [productos, fichas, token]);

  useEffect(() => {
    if (!ficha || !token) return;
    let vigente = true;
    const id = ficha.productoId;
    listarMovimientos(id, token)
      .then((filas) => { if (vigente) setHistorial({ id, revision, filas }); })
      .catch((error) => {
        if (!vigente) return;
        rechazarCredencial(error, token);
        setHistorial({ id, revision, error: error.message });
      });
    return () => { vigente = false; };
  }, [ficha, token, revision, rechazarCredencial]);

  function cambiarProducto(evento) {
    setSeleccion(evento.target.value);
    setCantidad("");
    setMotivo("");
    setError("");
    setMensaje("");
  }

  async function guardar(evento) {
    evento.preventDefault();
    if (!producto || !fichas || ocupado) return;
    const numero = Number(cantidad);
    if (cantidad === "" || !Number.isInteger(numero) || numero < 0 || numero > 2147483647
      || (ficha && tipo !== "AJUSTE" && numero === 0)) {
      setError("Ingresa una cantidad entera válida para esta operación.");
      return;
    }
    setOcupado(true);
    setError("");
    setMensaje("");
    try {
      if (ficha) {
        await registrarMovimiento({ productoId: producto.id, tipo, cantidad: numero, motivo }, token);
      } else {
        let existente;
        try {
          existente = await consultarExistencias(producto.id);
        } catch (error) {
          if (error.estado !== 404) throw error;
        }
        if (existente) {
          setMensaje("La ficha ya estaba registrada. Se conservó su saldo.");
          recargar();
          return;
        }
        await registrarFicha(producto, numero, token);
      }
      setCantidad("");
      setMotivo("");
      setMensaje(ficha ? "Movimiento registrado." : "Ficha de inventario registrada.");
      setRevision((actual) => actual + 1);
      recargar();
    } catch (error) {
      rechazarCredencial(error, token);
      setError(error.estado === 0 || error.estado >= 500
        ? "Resultado incierto. Consulta la ficha o el historial antes de volver a enviar."
        : error.message);
      recargar();
    } finally {
      setOcupado(false);
    }
  }

  const skuVistos = new Map();
  for (const item of fichas ?? []) {
    const sku = item.productoSku.trim().toUpperCase();
    skuVistos.set(sku, (skuVistos.get(sku) ?? 0) + 1);
  }
  const porProducto = new Map(fichas?.map((item) => [item.productoId, item]));
  const diferencias = productos.filter((p) => porProducto.has(p.id) && p.stock !== porProducto.get(p.id).stockActual);
  const pendientes = productos.filter((p) => fichas && !porProducto.has(p.id));
  const duplicados = [...skuVistos].filter(([, cantidad]) => cantidad > 1);
  const conflictos = pendientes.filter((p) => skuVistos.has("PROD-" + p.id));
  const historialActual = historial?.id === ficha?.productoId && historial?.revision === revision ? historial : null;

  return (
    <section className="card p-3 mb-4" aria-labelledby="tituloInventario">
      <h2 id="tituloInventario" className="h5">Existencias y movimientos</h2>
      {estado !== "disponible" && <p>{textoExistencias(estado)}</p>}
      <label htmlFor="productoInventario">Producto de inventario</label>
      <select id="productoInventario" className="form-select mb-2" value={seleccion} onChange={cambiarProducto} disabled={ocupado}>
        <option value="">Selecciona un producto</option>
        {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
      </select>
      {producto && fichas && (
        <form onSubmit={guardar}>
          <p>Saldo oficial: {textoExistencias(estado, ficha)}</p>
          {!ficha && <p>Ingresa una cantidad inicial confirmada en bodega.</p>}
          {ficha && <>
            <label htmlFor="tipoMovimiento">Tipo de movimiento</label>
            <select id="tipoMovimiento" className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="ENTRADA">Entrada</option>
              <option value="SALIDA">Salida</option>
              <option value="AJUSTE">Ajuste de saldo</option>
            </select>
            <label htmlFor="motivoMovimiento">Motivo</label>
            <input id="motivoMovimiento" className="form-control" maxLength={255} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </>}
          <label htmlFor="cantidadInventario">{!ficha ? "Cantidad inicial confirmada" : tipo === "AJUSTE" ? "Saldo final" : "Cantidad del movimiento"}</label>
          <input id="cantidadInventario" className="form-control mb-2" type="number" required min={ficha && tipo !== "AJUSTE" ? 1 : 0}
            max={2147483647} value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
          <button className="btn btn-warning" disabled={ocupado}>{ficha ? "Registrar movimiento" : "Registrar ficha"}</button>
        </form>
      )}
      {error && <p role="alert">{error}</p>}
      {mensaje && <p role="status">{mensaje}</p>}
      {ficha && <div className="mt-3">
        <h3 className="h6">Historial de movimientos</h3>
        {historialActual?.error && <p role="alert">{historialActual.error}</p>}
        {!historialActual && <p>Consultando movimientos…</p>}
        {historialActual?.filas?.length === 0 && <p>Sin movimientos.</p>}
        <ul>{historialActual?.filas?.map((mov) => <li key={mov.id}>{mov.tipo} · {mov.cantidad} · {mov.fecha} {mov.motivo}</li>)}</ul>
      </div>}
      {fichas && <details className="mt-3">
        <summary>Conciliación de registros</summary>
        <p>El saldo legado se muestra solo para revisión. Confirma el conteo antes de ajustar.</p>
        <ul>
          {pendientes.map((p) => <li key={"p"+p.id}>Producto sin ficha: #{p.id} {p.nombre}</li>)}
          {Object.entries(noListados).map(([id, descripcion]) => <li key={"h"+id}>{descripcion}: #{id}</li>)}
          {diferencias.map((p) => <li key={"d"+p.id}>#{p.id} {p.nombre}: legado {p.stock}, inventario {porProducto.get(p.id).stockActual}</li>)}
          {duplicados.map(([sku, cantidad]) => <li key={sku}>SKU duplicado: {sku} ({cantidad} fichas)</li>)}
          {conflictos.map((p) => <li key={"s"+p.id}>SKU propuesto PROD-{p.id} ya utilizado</li>)}
        </ul>
      </details>}
    </section>
  );
}
