// Ubicación: src/main/java/com/ferreteria/service/business/ProductoService.java
package com.ferreteria.service.business;

import com.ferreteria.entities.business.Producto;
import com.ferreteria.repository.business.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Transactional
    public Producto registrarProducto(Producto productoNuevo) {
        // Buscamos si ya existe un producto con el mismo nombre y marca.
        Optional<Producto> productoExistenteOpt = productoRepository.findByNombreAndMarca(
                productoNuevo.getNombre(),
                productoNuevo.getMarca()
        );

        if (productoExistenteOpt.isPresent()) {
            // Si existe, actualizamos el stock.
            Producto productoExistente = productoExistenteOpt.get();
            productoExistente.setStock(productoExistente.getStock() + productoNuevo.getStock());
            // Opcional: podrías actualizar también el precio si lo deseas.
            // productoExistente.setPrecio(productoNuevo.getPrecio());
            System.out.println("LOGICA DE NEGOCIO: El producto '" + productoExistente.getNombre() + "' ya existe. Sumando stock.");
            return productoRepository.save(productoExistente);
        } else {
            // Si no existe, lo creamos.
            System.out.println("LOGICA DE NEGOCIO: El producto '" + productoNuevo.getNombre() + "' es nuevo. Creando registro.");
            return productoRepository.save(productoNuevo);
        }
    }
}