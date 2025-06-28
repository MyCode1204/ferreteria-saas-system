// frontend/src/pages/client/views/GestionProductos/GestionProductos.jsx
import React, { useState, useEffect } from 'react';
// Rutas de importación corregidas
import { useAuth } from '../../../../hooks/useAuth';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../../services/api';
import ProductosTable from './components/ProductosTable';
import ProductoForm from './components/ProductoForm';

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { tenantId } = useAuth();

    // Función para obtener la lista de productos
    const fetchProducts = () => {
        if (tenantId) {
            getProducts(tenantId)
                .then(response => setProductos(response.data))
                .catch(error => console.error("Error al cargar productos:", error));
        }
    };

    // Cargar productos cuando el componente se monta o el tenantId cambia
    useEffect(() => {
        fetchProducts();
    }, [tenantId]);

    // Función para guardar (crear o actualizar) un producto
    const handleSave = async (productoData) => {
        try {
            if (productoSeleccionado) {
                // Actualizar producto existente
                await updateProduct(tenantId, productoSeleccionado.id, productoData);
            } else {
                // Crear nuevo producto
                await createProduct(tenantId, productoData);
            }
            fetchProducts(); // Recargar la lista de productos
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            // Aquí podrías mostrar una notificación de error al usuario
        } finally {
            setIsFormOpen(false);
            setProductoSeleccionado(null);
        }
    };
    
    // Función para eliminar un producto
    const handleDelete = async (productoId) => {
        // Es buena práctica pedir confirmación antes de borrar.
        // En una app real, usar un modal de confirmación es mejor que window.confirm.
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await deleteProduct(tenantId, productoId);
                fetchProducts(); // Recargar la lista
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        }
    };

    // Abre el formulario para editar un producto existente
    const handleEdit = (producto) => {
        setProductoSeleccionado(producto);
        setIsFormOpen(true);
    };

    // Abre el formulario para crear un nuevo producto
    const handleAddNew = () => {
        setProductoSeleccionado(null);
        setIsFormOpen(true);
    };

    // Cierra el formulario
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setProductoSeleccionado(null);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold">Gestión de Productos</h1>
                <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
                    Nuevo Producto
                </button>
            </div>
            
            <ProductosTable
                productos={productos}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {isFormOpen && (
                <ProductoForm
                    producto={productoSeleccionado}
                    onSave={handleSave}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default GestionProductos;
