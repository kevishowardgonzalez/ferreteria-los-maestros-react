import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buscarProducto } from "../services/productos";

function DetalleProducto() {
  const { id } = useParams();
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    let vigente = true;
    buscarProducto(id)
      .then((producto) => { if (vigente) setResultado({ id, producto }); })
      .catch((error) => { if (vigente) setResultado({ id, error }); });
    return () => { vigente = false; };
  }, [id]);

  if (resultado?.id !== id) return <p role="status">Cargando producto...</p>;
  if (resultado.error && resultado.error.estado !== 404) return <p role="alert">{resultado.error.message}</p>;
  const { producto } = resultado;
  if (!producto) {
    return (
      <main className="container py-4">
        <h1 className="h3">Producto no encontrado</h1>

        <p className="text-danger">
          El producto solicitado no existe en nuestro catálogo.
        </p>

        <Link to="/productos" className="btn btn-secondary">
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <span className="badge bg-secondary mb-2">
        {producto.categoria}
      </span>

      <h1 className="h2">{producto.nombre}</h1>

      <p className="lead text-muted">
        {producto.descripcion}
      </p>

      <p className="h4 text-primary fw-bold mb-3">
        ${producto.precio.toLocaleString("es-CL")}
      </p>

      <p>
        <strong>Stock disponible:</strong>{" "}
        {producto.stock} unidades
      </p>

      {producto.stock === 0 && (
        <p className="text-danger fw-bold">
          Producto sin stock disponible.
        </p>
      )}

      <Link
        to="/productos"
        className="btn btn-outline-primary"
      >
        ← Volver al catálogo
      </Link>
    </main>
  );
}

export default DetalleProducto;
