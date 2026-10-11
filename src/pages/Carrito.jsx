
import { Link } from "react-router-dom";

function Carrito({ carrito, onCambiarCantidad, onEliminar, onVaciar }) {
  let total = 0;

  carrito.forEach((producto) => {
    total += producto.precio * producto.cantidad;
  });

  if (carrito.length === 0) {
    return (
      <main className="container py-5">
        <h1 className="h2 mb-4">Carrito de compras</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/" className="btn btn-primary">
          Ver productos
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

                <td>
                  ${producto.precio.toLocaleString("es-CL")}
                </td>

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

                <td>
                  ${(producto.precio * producto.cantidad).toLocaleString("es-CL")}
                </td>

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
        Total: ${total.toLocaleString("es-CL")}
      </p>

      <div className="d-flex justify-content-end gap-2 flex-wrap">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onVaciar}
        >
          Vaciar carrito
        </button>

        <Link to="/" className="btn btn-outline-secondary">
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
