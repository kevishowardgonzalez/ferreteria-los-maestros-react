import { Link } from "react-router-dom";

function TarjetaProducto({ producto, onAgregar }) {
  return (
    <article className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary w-auto align-self-start mb-2">
          {producto.categoria}
        </span>
        <h3 className="h5 card-title">{producto.nombre}</h3>
        <p className="card-text text-muted flex-grow-1 small">
          {producto.descripcion}
        </p>
        <p className="h5 text-primary fw-bold my-2">
          ${producto.precio.toLocaleString("es-CL")}
        </p>

        {producto.stock > 0 && producto.stock <= 5 && (
          <p className="text-danger fw-bold small mb-2">¡Últimas unidades en bodega!</p>
        )}

        <div className="d-flex gap-2 mt-auto">
          <Link to={`/productos/${producto.id}`} className="btn btn-outline-secondary btn-sm w-50">
            Detalle
          </Link>
          <button
            type="button"
            className="btn btn-primary btn-sm w-50"
            onClick={() => onAgregar(producto)}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? "Sin stock" : "Añadir"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default TarjetaProducto;