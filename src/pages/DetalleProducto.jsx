import { Link, useParams } from "react-router-dom";
import { productos } from "../data/productos";

function DetalleProducto() {
    const { id } = useParams();
    const producto = productos.find((item) => item.id === Number(id));

    if (!producto) {
        return (
            <main className="container py-4">
                <p className="text-danger">El producto solicitado no existe.</p>
                <Link to="/" className="btn btn-secondary">Volver al catálogo</Link>
            </main>
        );
    }

    return (
        <main className="container py-4">
            <span className="badge bg-secondary mb-2">{producto.categoria}</span>
            <h1 className="h2">{producto.nombre}</h1>
            <p className="lead text-muted">{producto.descripcion}</p>
            <p className="h4 text-primary fw-bold mb-4">
                ${producto.precio.toLocaleString("es-CL")}
            </p>
            <Link to="/" className="btn btn-outline-primary">← Volver al catálogo</Link>
        </main>
    );
}

export default DetalleProducto;