// src/hooks/useProductos.js
import { useState, useEffect } from "react";
import { productos as listaInicial } from "../data/productos";
import { obtenerProductos, guardarProductos } from "../utils/persistencia";

export function useProductos() {
  const [productos, setProductos] = useState(() => obtenerProductos(listaInicial));
  const [categoria, setCategoria] = useState("Todas");

  useEffect(() => {
    guardarProductos(productos);
  }, [productos]);

  const visibles =
    categoria === "Todas"
      ? productos
      : productos.filter((prod) => prod.categoria === categoria);

  return {
    productos,
    setProductos,
    categoria,
    setCategoria,
    visibles,
  };
}