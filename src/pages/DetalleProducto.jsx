import { Link, useParams } from "react-router-dom";

function DetalleProducto({ productos }) {
  // Obtener el ID del producto desde la URL
  const { id } = useParams();

  // Buscar el producto en el estado compartido
  const producto = productos.find(
    (item) => item.id === Number(id)
  );

  // Si el producto no existe
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
