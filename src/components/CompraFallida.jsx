// src/components/CompraFallida.jsx
import { Link, useNavigate } from "react-router-dom";

function CompraFallida() {
  const navigate = useNavigate();

  return (
    <main className="container py-5 text-center">
      <div className="card shadow-sm border-0 p-4 p-md-5 mx-auto bg-white" style={{ maxWidth: "600px" }}>
        <div 
          className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: "70px", height: "70px", fontSize: "2rem" }}
        >
          ✕
        </div>

        <h1 className="h3 fw-bold text-danger mb-2">Pago simulado rechazado</h1>
        <p className="text-secondary mb-3">
          Ocurrió un inconveniente al validar la transacción bancaria simulada o seleccionaste la opción de pago rechazado.
        </p>
        <p className="small text-muted mb-4">
          No se ha efectuado ningún cargo. Puedes volver al checkout para revisar tus opciones de pago o verificar el carrito de compras.
        </p>

        <div className="d-flex justify-content-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="btn btn-warning text-dark fw-bold px-4"
          >
            Volver a intentar
          </button>
          <Link to="/carrito" className="btn btn-outline-secondary px-4">
            Revisar Carrito
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CompraFallida;