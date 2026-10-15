// src/pages/Nosotros.jsx
function Nosotros() {
  return (
    <main className="container py-4">
      <h1 className="h2 mb-3 fw-bold text-dark">Nuestra Historia</h1>

      {/* Párrafo completo en letra negra sólida */}
      <p className="lead text-dark mb-4">

        <span className="fw-semibold text-dark">
          <strong>Ferretería Los Maestros</strong> es una empresa familiar en La Serena con más de 22 años equipando faenas, contratistas y familias de la Región de Coquimbo.
        </span>
      </p>

      <div className="row g-4 mt-2">
        <div className="col-12 col-md-4">
          <div className="card h-100 p-3 shadow-sm border border-secondary border-opacity-25 bg-white">
            <h2 className="h5 fw-bold text-dark">Experiencia</h2>
            <p className="text-secondary small mb-0">
              Asesoría técnica directa en herramientas y materiales de construcción.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 p-3 shadow-sm border border-secondary border-opacity-25 bg-white">
            <h2 className="h5 fw-bold text-dark">Atención a Obras</h2>
            <p className="text-secondary small mb-0">
              Venta por mayor, convenios y stock permanente para contratistas.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 p-3 shadow-sm border border-secondary border-opacity-25 bg-white">
            <h2 className="h5 fw-bold text-dark">Compromiso Local</h2>
            <p className="text-secondary small mb-0">
              Enraizados en La Serena, impulsando el trabajo de los maestros locales.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Nosotros;