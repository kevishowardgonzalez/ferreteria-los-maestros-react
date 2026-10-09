import FormularioProducto from "./FormularioProducto";

function AdminProductos() {
    function guardar(producto) {
        console.log("Producto guardado:", producto);
        alert(`Producto "${producto.nombre}" registrado exitosamente.`);
    }

    return (
        <main className="container py-4">
            <h1 className="h3 mb-4">Administración de Productos</h1>
            <FormularioProducto onGuardar={guardar} />
        </main>
    );
}

export default AdminProductos;