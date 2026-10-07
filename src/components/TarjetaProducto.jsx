function TarjetaProducto({ nombre, precio, descripcion, categoria }) {
  return (
    <article className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        {categoria && (
          <span className="badge bg-secondary w-auto align-self-start mb-2">
            {categoria}
          </span>
        )}
        <h3 className="h5 card-title">{nombre || "Producto"}</h3>
        <p className="card-text text-muted flex-grow-1 small">
          {descripcion || "Sin descripción disponible."}
        </p>
        <p className="h5 text-primary fw-bold my-2">{precio || "$0"}</p>
        <button type="button" className="btn btn-primary mt-auto w-100">
          Añadir al Carrito
        </button>
      </div>
    </article>
  );
}

export default TarjetaProducto;