// src/components/CompraExitosa.jsx
import { Link, useLocation } from "react-router-dom";
import { formatearPrecio } from "../utils/precio";

function CompraExitosa() {
  const location = useLocation();
  const pedido = location.state?.pedido;

  return (
    <main className="container py-5 text-center">
      <div className="card shadow-sm border-0 p-4 p-md-5 mx-auto bg-white" style={{ maxWidth: "650px" }}>
        <div 
          className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: "70px", height: "70px", fontSize: "2rem" }}
        >
          ✓
        </div>

        <h1 className="h3 fw-bold text-success mb-2">¡Compra realizada con éxito!</h1>
        <p className="text-muted mb-4">
          Tu pedido en Ferretería Los Maestros ha sido procesado correctamente.
        </p>

        {pedido ? (
          <div className="bg-light rounded-3 p-3 text-start mb-4 border">
            <h2 className="h6 fw-bold text-dark border-bottom pb-2 mb-3">
              Comprobante de Pedido #{pedido.id}
            </h2>

            <p className="small mb-1">
              <strong>Cliente:</strong> {pedido.cliente.nombre} {pedido.cliente.apellido}
            </p>
            <p className="small mb-1">
              <strong>Correo:</strong> {pedido.cliente.correo}
            </p>
            <p className="small mb-3">
              <strong>Tipo de Entrega:</strong>{" "}
              {pedido.cliente.entrega === "domicilio" ? "Despacho a domicilio" : "Retiro en tienda"}
            </p>

            {pedido.cliente.entrega === "domicilio" && (
              <p className="small mb-3 text-muted">
                <strong>Dirección:</strong> {pedido.cliente.calle} #{pedido.cliente.numero}, {pedido.cliente.comuna}, {pedido.cliente.region}
              </p>
            )}

            <div className="border-top pt-2 mt-2">
              <span className="small text-muted fw-semibold">Herramientas y materiales:</span>
              <ul className="list-unstyled small mt-2 mb-0">
                {pedido.productos.map((prod) => (
                  <li key={prod.id} className="d-flex justify-content-between mb-1">
                    <span>{prod.nombre} × {prod.cantidad}</span>
                    <span className="fw-bold">
                      {formatearPrecio(prod.precio * prod.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-top pt-2 mt-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total pagado:</span>
              <span className="h5 fw-bold text-primary mb-0">
                {formatearPrecio(pedido.total)}
              </span>
            </div>
          </div>
        ) : (
          <p className="small text-muted mb-4">
            Simulación académica registrada con éxito.
          </p>
        )}

        <div className="d-flex justify-content-center gap-2">
          <Link to="/productos" className="btn btn-warning text-dark fw-bold px-4">
            Volver al catálogo
          </Link>
          <Link to="/cliente/compras" className="btn btn-outline-primary px-4">
            Ver Mis Compras
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CompraExitosa;