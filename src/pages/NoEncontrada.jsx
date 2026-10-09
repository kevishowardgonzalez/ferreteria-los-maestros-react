import { Link } from "react-router-dom";

function NoEncontrada() {
    return (
        <main className="container py-5 text-center">
            <h1 className="display-4 text-danger">404</h1>
            <h2 className="h4">Página no encontrada</h2>
            <p className="text-muted">La dirección ingresada no corresponde a una vista válida.</p>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </main>
    );
}

export default NoEncontrada;