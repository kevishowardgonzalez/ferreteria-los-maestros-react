// src/hooks/useCarrito.js
import { useState, useEffect } from "react";
import { guardarCarrito, obtenerCarrito } from "../utils/persistencia";

export function useCarrito() {
  const [carrito, setCarrito] = useState(() => obtenerCarrito());

  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  function agregarAlCarrito(producto) {
    setCarrito((prev) => {
      const itemExistente = prev.find((item) => item.id === producto.id);
      if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
          return prev.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        } else {
          window.alert("No hay más stock disponible de este producto.");
          return prev;
        }
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }

  function cambiarCantidad(id, nuevaCantidad) {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  }

  function eliminarDelCarrito(id) {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const cantidadTotalCarrito = carrito.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );

  return {
    carrito,
    cantidadTotalCarrito,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  };
}