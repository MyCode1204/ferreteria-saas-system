import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Creamos el store con Zustand
export const useSalesStore = create(
    // `persist` es un middleware de Zustand que guardará el estado en el localStorage.
    // Esto significa que las ventas persistirán ¡incluso si cierras o recargas la página!
    persist(
        (set, get) => ({
            // --- ESTADO INICIAL ---
            activeSales: [],
            currentSaleIndex: 0,

            // --- ACCIONES (FUNCIONES PARA MODIFICAR EL ESTADO) ---

            // Inicializa con una venta si el store está vacío
            initialize: () => {
                if (get().activeSales.length === 0) {
                    get().addNewSale();
                }
            },
            
            // Añade una nueva pestaña de venta
            addNewSale: () => {
                const newSale = { 
                    id: crypto.randomUUID(), // ID temporal para el key de React
                    detalles: [], 
                    clienteId: null, 
                    metodoPago: 'Efectivo',
                    efectivoRecibido: '',
                };
                set(state => ({ 
                    activeSales: [...state.activeSales, newSale],
                    currentSaleIndex: state.activeSales.length // Cambia a la nueva pestaña
                }));
            },

            // Cierra una pestaña de venta
            closeSale: (indexToClose) => {
                // No permitir cerrar la última venta
                if (get().activeSales.length <= 1) return;

                set(state => {
                    const newSales = state.activeSales.filter((_, index) => index !== indexToClose);
                    let newIndex = state.currentSaleIndex;
                    
                    // Ajusta el índice activo si es necesario
                    if (newIndex >= indexToClose && newIndex > 0) {
                        newIndex--;
                    } else if (newIndex >= newSales.length) {
                        newIndex = newSales.length -1;
                    }

                    return { activeSales: newSales, currentSaleIndex: newIndex };
                });
            },
            
            // Limpia y reinicia el estado después de una venta exitosa
            resetSale: (indexToReset) => {
                 set(state => {
                    const newSales = [...state.activeSales];
                    // Reemplaza la venta completada por una nueva y vacía
                    newSales[indexToReset] = {
                        id: crypto.randomUUID(),
                        detalles: [],
                        clienteId: null,
                        metodoPago: 'Efectivo',
                        efectivoRecibido: ''
                    };
                    return { activeSales: newSales };
                });
            },

            // Selecciona una pestaña de venta
            setCurrentSaleIndex: (index) => set({ currentSaleIndex: index }),

            // Actualiza un campo de la venta activa (cliente, método de pago, etc.)
            updateActiveSaleField: (field, value) => {
                set(state => {
                    const newSales = [...state.activeSales];
                    if (newSales[state.currentSaleIndex]) {
                        newSales[state.currentSaleIndex][field] = value;
                    }
                    return { activeSales: newSales };
                });
            },

            // --- ACCIONES DEL CARRITO ---
            
            agregarAlCarrito: (producto) => {
                 set(state => {
                    const newSales = [...state.activeSales];
                    const sale = newSales[state.currentSaleIndex];
                    if (!sale) return { activeSales: newSales };

                    const itemExistente = sale.detalles.find(item => item.productoId === producto.id);

                    if (itemExistente) {
                        if (itemExistente.cantidad < producto.stock) {
                            itemExistente.cantidad++;
                            itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
                        }
                    } else {
                        if (producto.stock > 0) {
                            sale.detalles.push({
                                productoId: producto.id,
                                nombre: producto.nombre,
                                precioUnitario: producto.precio,
                                cantidad: 1,
                                subtotal: producto.precio,
                                stockMax: producto.stock
                            });
                        }
                    }
                    return { activeSales: newSales };
                });
            },
            
            actualizarCantidad: (productoId, nuevaCantidad) => {
                 set(state => {
                    const newSales = [...state.activeSales];
                    const sale = newSales[state.currentSaleIndex];
                    if (!sale) return { activeSales: newSales };

                    const item = sale.detalles.find(p => p.productoId === productoId);
                    if (item) {
                        const cantidadValidada = Math.max(1, Math.min(nuevaCantidad, item.stockMax));
                        item.cantidad = cantidadValidada;
                        item.subtotal = item.cantidad * item.precioUnitario;
                    }
                    return { activeSales: newSales };
                });
            },

            eliminarDelCarrito: (productoId) => {
                 set(state => {
                    const newSales = [...state.activeSales];
                    const sale = newSales[state.currentSaleIndex];
                     if (sale) {
                        sale.detalles = sale.detalles.filter(p => p.productoId !== productoId);
                    }
                    return { activeSales: newSales };
                });
            },
        }),
        {
            name: 'sales-storage', // Nombre para el guardado en localStorage
        }
    )
);