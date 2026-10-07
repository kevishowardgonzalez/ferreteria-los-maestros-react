import { Container } from "react-bootstrap";

function PiePagina() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto border-top border-secondary">
      <Container>
        <div className="row gy-3">
          <div className="col-12 col-md-6">
            <h5 className="fw-bold">🔨 Ferretería Los Maestros</h5>
            <address className="mb-0 text-secondary small">
              📍 Av. Principal 1234, La Serena, Región de Coquimbo<br />
              📞 Teléfono: +56 51 234 5678<br />
              ✉️ Contacto: contacto@losmaestros.cl
            </address>
          </div>
          <div className="col-12 col-md-6 text-md-end d-flex align-items-end justify-content-md-end">
            <small className="text-secondary">
              Proyecto académico · DSY1104 Desarrollo FullStack II · Duoc UC
            </small>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default PiePagina;