import React, { useState, useEffect, useMemo } from 'react';
import { Search, Trash2, PlusCircle, MinusCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
// Necesitaremos crear estas funciones en nuestro servicio de API
import { getProducts, createSale } from '../../../services/api';

const VentaRapida = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [efectivoRecibido, setEfectivoRecibido] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const { tenantId } = useAuth();

    useEffect(() => {
        if (tenantId) {
            getProducts(tenantId)
                .then(response => setProductos(response.data))
                .catch(err => {
                    console.error("Error al cargar productos:", err)
                    setError("No se pudieron cargar los productos.");
                });
        }
    }, [tenantId]);

    const productosFiltrados = useMemo(() => {
        if (!terminoBusqueda) return [];
        return productos.filter(p =>
            p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
            p.marca?.toLowerCase().includes(terminoBusqueda.toLowerCase())
        ).slice(0, 5); // Limitar a 5 resultados para no saturar
    }, [terminoBusqueda, productos]);

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const itemExistente = prev.find(item => item.id === producto.id);
            if (itemExistente) {
                if(itemExistente.cantidad < producto.stock) {
                   return prev.map(item =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
                }
                setError(`Stock máximo alcanzado para ${producto.nombre}`);
                setTimeout(() => setError(''), 3000);
                return prev;
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
        setTerminoBusqueda('');
    };

    const actualizarCantidad = (productoId, delta) => {
        setCarrito(prev => prev.map(item => {
            const productoOriginal = productos.find(p => p.id === item.id);
            if(item.id === productoId) {
                const nuevaCantidad = item.cantidad + delta;
                if (nuevaCantidad > productoOriginal.stock) {
                    setError(`Stock máximo (${productoOriginal.stock}) alcanzado.`);
                    setTimeout(() => setError(''), 3000);
                    return item; // No cambia la cantidad si excede el stock
                }
                return { ...item, cantidad: Math.max(0, nuevaCantidad) }
            }
            return item;
        }).filter(item => item.cantidad > 0)); // Eliminar si la cantidad llega a 0
    };


    const eliminarDelCarrito = (productoId) => {
        setCarrito(prev => prev.filter(item => item.id !== productoId));
    };

    const totalVenta = useMemo(() => {
        return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    }, [carrito]);

    const vuelto = useMemo(() => {
        const recibido = parseFloat(efectivoRecibido);
        if (isNaN(recibido) || recibido < totalVenta) return 0;
        return recibido - totalVenta;
    }, [efectivoRecibido, totalVenta]);


    const manejarVenta = async () => {
        setError('');
        setMensajeExito('');
        if (carrito.length === 0) {
            setError("El carrito está vacío.");
            return;
        }

        const ventaRequest = {
            clienteId: null, // Opcional: añadir un selector de cliente
            metodoPago,
            detalles: carrito.map(item => ({
                productoId: item.id,
                cantidad: item.cantidad,
            })),
        };

        try {
            await createSale(tenantId, ventaRequest);
            setMensajeExito(`Venta registrada por S/ ${totalVenta.toFixed(2)}.`);
            setCarrito([]);
            setEfectivoRecibido('');
            // Actualizar stock localmente para reflejar la venta
            getProducts(tenantId).then(response => setProductos(response.data));
            setTimeout(() => setMensajeExito(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || "Error al registrar la venta.");
            setTimeout(() => setError(''), 5000);
        }
    };


    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Venta Rápida</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Carrito y Totales */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="relative mb-4">
                        <label htmlFor="search" className="sr-only">Buscar producto</label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Código o nombre del producto..."
                            value={terminoBusqueda}
                            onChange={e => setTerminoBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        {productosFiltrados.length > 0 && (
                            <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-xl">
                                {productosFiltrados.map(p => (
                                    <li
                                        key={p.id}
                                        onClick={() => agregarAlCarrito(p)}
                                        className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                                    >
                                        {p.nombre} ({p.marca}) - Stock: {p.stock}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Tabla de productos en el carrito */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Producto</th>
                                    <th className="py-2 text-center">Cantidad</th>
                                    <th className="py-2 text-right">Precio</th>
                                    <th className="py-2 text-right">Subtotal</th>
                                    <th className="py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrito.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-8 text-gray-500">El carrito está vacío</td></tr>
                                ) : (
                                    carrito.map(item => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-3">{item.nombre}</td>
                                            <td className="py-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button onClick={() => actualizarCantidad(item.id, -1)} className="text-red-500 hover:text-red-700"><MinusCircle size={18}/></button>
                                                    <span>{item.cantidad}</span>
                                                     <button onClick={() => actualizarCantidad(item.id, 1)} className="text-green-500 hover:text-green-700"><PlusCircle size={18}/></button>
                                                </div>
                                            </td>
                                            <td className="py-3 text-right">S/ {item.precio.toFixed(2)}</td>
                                            <td className="py-3 text-right font-semibold">S/ {(item.precio * item.cantidad).toFixed(2)}</td>
                                            <td className="py-3 text-center">
                                                <button onClick={() => eliminarDelCarrito(item.id)} className="text-gray-500 hover:text-red-600">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Columna Derecha: Resumen de pago */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-4">Resumen de la Venta</h2>
                    <div className="space-y-3">
                         <div className="flex justify-between text-lg">
                            <span>Total:</span>
                            <span className="font-bold">S/ {totalVenta.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="efectivo" className="text-lg">Efectivo:</label>
                             <input
                                id="efectivo"
                                type="number"
                                value={efectivoRecibido}
                                onChange={e => setEfectivoRecibido(e.target.value)}
                                placeholder="S/ 0.00"
                                className="w-32 px-2 py-1 text-right border rounded-md"
                             />
                        </div>
                        <div className="flex justify-between text-lg">
                            <span>Vuelto:</span>
                            <span className="font-bold text-green-600">S/ {vuelto.toFixed(2)}</span>
                        </div>
                    </div>
                    <hr className="my-4"/>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Método de pago:</h3>
                        <div className="flex flex-col space-y-2">
                           {['Efectivo', 'Yape', 'Plin', 'Tarjeta'].map(metodo => (
                                <label key={metodo} className="flex items-center">
                                    <input type="radio" name="pago" value={metodo} checked={metodoPago === metodo} onChange={() => setMetodoPago(metodo)} className="text-indigo-600 focus:ring-indigo-500"/>
                                    <span className="ml-2">{metodo}</span>
                                </label>
                           ))}
                        </div>
                    </div>
                    <button
                        onClick={manejarVenta}
                        className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Confirmar Venta
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    {mensajeExito && <p className="text-green-500 text-sm mt-2 text-center">{mensajeExito}</p>}
                </div>
            </div>
        </div>
    );
};

export default VentaRapida;