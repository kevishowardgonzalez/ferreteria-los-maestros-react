
 function Nosotros() {
  return (
    <main className="container py-4">
      <h1 className="h2 mb-3">Nuestra Historia</h1>
      <p className="lead text-muted">
        <strong>Ferretería Los Maestros</strong> es una empresa familiar en La Serena con más de 22 años equipando faenas, contratistas y familias de la Región de Coquimbo.
      </p>
      
      <div className="row g-4 mt-2">
        <div className="col-12 col-md-4">
          <div className="card h-100 p-3 shadow-sm border-0">
            <h2 className="h5">Experiencia</h2>
            <p className="text-secondary small">Asesoría técnica directa en herramientas y materiales de construcción.</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 p-3 shadow-sm border-0">
            <h2 className="h5">Atención a Obras</h2>
            <p className="text-secondary small">Venta por mayor, convenios y stock permanente para contratistas.</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card h-100 p-3 shadow-sm border-0">
            <h2 className="h5">Compromiso Local</h2>
            <p className="text-secondary small">Enraizados en La Serena, impulsando el trabajo de los maestros locales.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Nosotros;