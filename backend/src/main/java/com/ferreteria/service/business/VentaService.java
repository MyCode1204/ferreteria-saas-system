// src/main/java/com/ferreteria/service/business/VentaService.java
package com.ferreteria.service.business;

import com.ferreteria.dto.request.VentaRequest;
import com.ferreteria.dto.response.StockNotification;
import com.ferreteria.entities.business.*;
import com.ferreteria.repository.business.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificationService notificationService;

    public VentaService(VentaRepository ventaRepository, ProductoRepository productoRepository,
                        ClienteRepository clienteRepository, UsuarioRepository usuarioRepository, NotificationService notificationService) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Venta registrarVenta(VentaRequest ventaRequest, String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cliente cliente = null;
        if (ventaRequest.getClienteId() != null) {
            cliente = clienteRepository.findById(ventaRequest.getClienteId())
                    .orElse(null); // Venta sin cliente (público general)
        }

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setCliente(cliente);
        venta.setMetodoPago(ventaRequest.getMetodoPago());
        venta.setEstado("COMPLETADA");

        List<DetalleVenta> detalles = new ArrayList<>();
        double totalVenta = 0.0;

        for (var detalleRequest : ventaRequest.getDetalles()) {

            Producto producto = productoRepository.findById(detalleRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + detalleRequest.getProductoId()));

            if (producto.getStock() < detalleRequest.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleRequest.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(producto.getPrecio() * detalleRequest.getCantidad());
            detalle.setVenta(venta);
            detalles.add(detalle);

            totalVenta += detalle.getSubtotal();
            producto.setStock(producto.getStock() - detalleRequest.getCantidad());

            if (producto.getStock() <= producto.getStockMinimo()) {
                String tenantId = com.ferreteria.tenant.TenantContext.getCurrentTenant();
                notificationService.sendStockLowNotification(
                        tenantId,
                        new StockNotification(
                                producto.getId(),
                                producto.getNombre(),
                                producto.getStock(),
                                producto.getStockMinimo()
                        )
                );
            }

            productoRepository.save(producto);
        }

        venta.setTotal(totalVenta);
        venta.setDetalles(detalles);

        return ventaRepository.save(venta);
    }
}