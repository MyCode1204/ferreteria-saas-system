// frontend/src/pages/client/views/GestionProductos/components/ProductoForm.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductoForm = ({ producto, onSave, onClose }) => {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        precio: '',
        stock: '',
        stockMinimo: ''
    });

    // Efecto para llenar el formulario si se está editando un producto
    useEffect(() => {
        if (producto) {
            setFormData({
                nombre: producto.nombre || '',
                marca: producto.marca || '',
                precio: producto.precio || '',
                stock: producto.stock || '',
                stockMinimo: producto.stockMinimo || ''
            });
        }
    }, [producto]);

    // Manejador para actualizar el estado cuando cambia un input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejador para enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        // Convierte los valores numéricos antes de guardar
        const dataToSave = {
            ...formData,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock, 10),
            stockMinimo: parseInt(formData.stockMinimo, 10)
        };
        onSave(dataToSave);
    };

    return (
        // Modal overlay
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-down">
                {/* Encabezado del Modal */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                
                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Campo Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>

                        {/* Campo Marca */}
                        <div>
                            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">Marca</label>
                            <input type="text" id="marca" name="marca" value={formData.marca} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        {/* Campos Precio y Stock en una fila */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio (S/)</label>
                                <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required min="0.01" step="0.01" />
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Actual</label>
                                <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required min="0" />
                            </div>
                        </div>

                        {/* Campo Stock Mínimo */}
                        <div>
                            <label htmlFor="stockMinimo" className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
                            <input type="number" id="stockMinimo" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required min="0" />
                        </div>
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ProductoForm;