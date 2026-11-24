// src/components/TarjetaProducto.jsx
function TarjetaProducto({ producto, onAgregar }) {
  return (
    <article className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">
          {producto.categoria}
        </span>
        <h2 className="h5 card-title fw-bold text-dark">{producto.nombre}</h2>
        <p className="card-text text-muted small flex-grow-1">
          {producto.descripcion}
        </p>
        <p className="h5 text-primary fw-bold my-2">
          ${producto.precio?.toLocaleString("es-CL")}
        </p>

        {producto.stock > 0 && producto.stock <= 5 && (
          <p className="text-danger fw-bold small mb-2">¡Últimas unidades!</p>
        )}

        <button
          type="button"
          className="btn btn-warning w-100 fw-bold mt-auto"
          onClick={() => onAgregar(producto)}
          disabled={producto.stock === 0}
        >
          {producto.stock === 0 ? "Sin stock" : "Añadir al Carrito"}
        </button>
      </div>
    </article>
  );
}

export default TarjetaProducto;