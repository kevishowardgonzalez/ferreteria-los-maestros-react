import { useState } from "react";
import { Button, Form } from "react-bootstrap";
function Blogs() {
  return (
    <main className="container py-4">
      <h1 className="h2 mb-4">Guías Técnicas y Noticias</h1>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <article className="card h-100 shadow-sm border-0 p-3">
            <span className="badge bg-warning text-dark w-auto align-self-start mb-2">
              Guía #1
            </span>
            <h2 className="h5">
              Cómo elegir el cemento según el clima de La Serena
            </h2>
            <p className="text-muted small flex-grow-1">
              Factores clave sobre la salinidad costera, fraguado y cómo proteger tus obras de la humedad marina.
            </p>
          </article>
        </div>

        <div className="col-12 col-md-6">
          <article className="card h-100 shadow-sm border-0 p-3">
            <span className="badge bg-warning text-dark w-auto align-self-start mb-2">
              Consejo #2
            </span>
            <h2 className="h5">
              Mantenimiento de herramientas eléctricas
            </h2>
            <p className="text-muted small flex-grow-1">
              Revisión periódica de escobillas, limpieza de polvo en percutores y cuidado de baterías de litio.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}

export default Blogs;
