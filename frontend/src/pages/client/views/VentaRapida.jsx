import React, { useState, useEffect, useMemo } from 'react';
import { Search, Trash2, PlusCircle, MinusCircle, X, ShoppingCart, DollarSign } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { getProducts, createSale, getClients } from '../../../services/api';
// ¡Importamos nuestro store!
import { useSalesStore } from '../../../stores/salesStore';

const VentaRapida = () => {
    // --- ESTADO GLOBAL (desde ZUSTAND) ---
    const { 
        activeSales, 
        currentSaleIndex,
        initialize,
        addNewSale,
        closeSale,
        resetSale,
        setCurrentSaleIndex,
        updateActiveSaleField,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito
    } = useSalesStore();

    // --- ESTADO LOCAL (solo para este componente) ---
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const { tenantId } = useAuth();
    
    // --- DATOS INICIALES ---
    useEffect(() => {
        initialize();
        if (tenantId) {
            getProducts(tenantId).then(res => setProductos(res.data)).catch(console.error);
            getClients(tenantId).then(res => setClientes(res.data)).catch(console.error);
        }
    }, [tenantId, initialize]);

    // --- VALORES CALCULADOS (MEMOIZED) ---
    const ventaActiva = useMemo(() => activeSales[currentSaleIndex] || null, [activeSales, currentSaleIndex]);
    const carrito = useMemo(() => ventaActiva?.detalles || [], [ventaActiva]);
    const totalCarrito = useMemo(() => carrito.reduce((total, item) => total + item.subtotal, 0), [carrito]);
    const productosFiltrados = useMemo(() =>
        terminoBusqueda ? productos.filter(p => p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())).slice(0, 10) : [],
    [productos, terminoBusqueda]);

    // --- LÓGICA PARA COMPLETAR LA VENTA ---
    const manejarVenta = async () => {
        if (!ventaActiva || ventaActiva.detalles.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
        const ventaData = {
            clienteId: ventaActiva.clienteId,
            metodoPago: ventaActiva.metodoPago,
            detalles: ventaActiva.detalles.map(d => ({
                productoId: d.productoId,
                cantidad: d.cantidad,
            }))
        };
        try {
            await createSale(tenantId, ventaData);
            alert("¡Venta registrada con éxito!");
            resetSale(currentSaleIndex);
        } catch (error) {
            console.error("Error al registrar la venta:", error);
            alert("Error al registrar la venta: " + (error.response?.data?.message || error.message));
        }
    };
    
    if (!ventaActiva) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mx-auto p-4">
             <h1 className="text-3xl font-bold text-gray-800 mb-6">Punto de Venta</h1>
            
            <div className="flex border-b mb-4 items-center">
                {activeSales.map((sale, index) => (
                    <div key={sale.id} className={`flex items-center py-2 px-4 cursor-pointer relative ${currentSaleIndex === index ? 'border-b-2 border-indigo-500 text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                        <button onClick={() => setCurrentSaleIndex(index)}>
                            Venta {index + 1}
                        </button>
                        {activeSales.length > 1 && (
                            <button onClick={(e) => { e.stopPropagation(); closeSale(index); }} className="ml-2 rounded-full hover:bg-red-100 p-1">
                                <X size={14} className="text-red-500" />
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={addNewSale} className="py-2 px-4 text-gray-500 hover:text-indigo-600">
                    <PlusCircle size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* --- COLUMNA IZQUIERDA: BUSCADOR Y PRODUCTOS --- */}
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                     <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar productos por nombre..."
                            className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-indigo-300"
                            value={terminoBusqueda}
                            onChange={(e) => setTerminoBusqueda(e.target.value)}
                        />
                    </div>
                     <div className="max-h-96 overflow-y-auto">
                        {productosFiltrados.map(p => (
                            <div key={p.id} onClick={() => agregarAlCarrito(p)} className="flex justify-between items-center p-3 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors duration-200">
                                <div>
                                    <p className="font-semibold">{p.nombre}</p>
                                    <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                                </div>
                                <p className="font-bold text-indigo-600">S/ {p.precio.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: CARRITO Y PAGO --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="text-indigo-600" />
                        <h2 className="text-xl font-bold">Resumen de Venta {currentSaleIndex + 1}</h2>
                    </div>

                    <div className="max-h-60 overflow-y-auto mb-4 border-b">
                         {carrito.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">El carrito está vacío</p>
                         ) : carrito.map(item => (
                            <div key={item.productoId} className="flex items-center mb-3">
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.nombre}</p>
                                    <p className="text-sm text-gray-500">S/ {item.precioUnitario.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)} className="p-1 rounded-full bg-gray-200"><MinusCircle size={16}/></button>
                                    <span>{item.cantidad}</span>
                                    <button onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)} className="p-1 rounded-full bg-gray-200"><PlusCircle size={16}/></button>
                                </div>
                                <p className="w-20 text-right font-semibold">S/ {item.subtotal.toFixed(2)}</p>
                                <button onClick={() => eliminarDelCarrito(item.productoId)} className="ml-2 text-red-500"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-2xl font-bold">
                            <span>TOTAL:</span>
                            <span>S/ {totalCarrito.toFixed(2)}</span>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cliente (Opcional)</label>
                            <select
                                value={ventaActiva.clienteId || ''}
                                onChange={(e) => updateActiveSaleField('clienteId', e.target.value || null)}
                                className="w-full p-2 border rounded-lg mt-1"
                            >
                                <option value="">Público General</option>
                                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Método de Pago</label>
                             <select
                                value={ventaActiva.metodoPago}
                                onChange={(e) => updateActiveSaleField('metodoPago', e.target.value)}
                                className="w-full p-2 border rounded-lg mt-1"
                            >
                                <option>Efectivo</option>
                                <option>Tarjeta de Crédito</option>
                                <option>Yape</option>
                                <option>Plin</option>
                            </select>
                        </div>
                        <button 
                            onClick={manejarVenta}
                            disabled={carrito.length === 0}
                            className="w-full bg-green-600 text-white p-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        >
                            <DollarSign /> Completar Venta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VentaRapida;