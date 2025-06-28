// frontend/src/pages/client/views/GestionProductos/components/ProductosTable.jsx
import React from 'react';

const ProductosTable = ({ productos, onEdit }) => {
    return (
        <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
                <tr className="border-b">
                    <th className="py-2 px-4">Nombre</th>
                    <th className="py-2 px-4">Marca</th>
                    <th className="py-2 px-4">Precio</th>
                    <th className="py-2 px-4">Stock</th>
                    <th className="py-2 px-4">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {productos.map(producto => (
                    <tr key={producto.id} className="border-b">
                        <td className="py-2 px-4">{producto.nombre}</td>
                        <td className="py-2 px-4">{producto.marca}</td>
                        <td className="py-2 px-4">S/ {producto.precio.toFixed(2)}</td>
                        <td className="py-2 px-4">{producto.stock}</td>
                        <td className="py-2 px-4">
                            <button onClick={() => onEdit(producto)} className="text-indigo-600 hover:underline">
                                Editar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProductosTable;