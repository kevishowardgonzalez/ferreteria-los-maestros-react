// src/pages/Inicio.jsx
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import Bienvenida from "../components/Bienvenida";

function Inicio() {
  return (
    <main className="container py-4 text-center">
      <Bienvenida />
      <div className="mt-4">
        <Button as={Link} to="/productos" variant="warning" size="lg" className="fw-bold">
          Ver Catálogo Completo de Productos
        </Button>
      </div>
    </main>
  );
}

export default Inicio;