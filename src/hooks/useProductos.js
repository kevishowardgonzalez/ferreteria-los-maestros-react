import { useEffect, useState } from "react";
import { listarCategoriasActivas } from "../services/categorias";
import { listarProductos } from "../services/productos";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorCategorias, setErrorCategorias] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError("");
    listarProductos()
      .then((datos) => { if (vigente) setProductos(datos); })
      .catch((error) => { if (vigente) setError(error.message); })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [revision]);

  useEffect(() => {
    let vigente = true;
    setErrorCategorias("");
    listarCategoriasActivas()
      .then((datos) => {
        if (!vigente) return;
        setCategorias(datos);
        setCategoria((actual) => datos.some(({ nombre }) => nombre === actual) ? actual : "Todas");
      })
      .catch((error) => { if (vigente) setErrorCategorias(error.message); });
    return () => { vigente = false; };
  }, [revision]);

  const visibles = categoria === "Todas" ? productos : productos.filter((item) => item.categoria === categoria);
  const recargar = () => setRevision((actual) => actual + 1);
  return { productos, categorias, categoria, setCategoria, visibles, cargando, error, errorCategorias, recargar };
}
