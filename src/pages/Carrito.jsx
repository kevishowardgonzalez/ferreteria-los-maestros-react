// src/pages/Carrito.jsx
import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/precio";
import { calcularTotal } from "../utils/carrito";

function Carrito({ carrito, onCambiarCantidad, onEliminar, onVaciar }) {
  const total = calcularTotal(carrito);

  if (carrito.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h2 mb-4">Carrito de compras</h1>
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-warning fw-bold">
          Ver todos los productos
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="h2 mb-4">Carrito de compras</h1>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {carrito.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      disabled={producto.cantidad <= 1}
                      onClick={() =>
                        onCambiarCantidad(producto.id, producto.cantidad - 1)
                      }
                    >
                      -
                    </button>

                    <span>{producto.cantidad}</span>

                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      disabled={producto.cantidad >= producto.stock}
                      onClick={() =>
                        onCambiarCantidad(producto.id, producto.cantidad + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </td>

                <td>{formatearPrecio(producto.precio * producto.cantidad)}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onEliminar(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="h4 text-end">
        Total: {formatearPrecio(total)}
      </p>

      <div className="d-flex justify-content-end gap-2 flex-wrap">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onVaciar}
        >
          Vaciar carrito
        </button>

        <Link to="/productos" className="btn btn-outline-secondary">
          Seguir comprando
        </Link>

        <Link to="/checkout" className="btn btn-success">
          Continuar al checkout
        </Link>
      </div>
    </main>
  );
}

export default Carrito;