// Ubicación: src/main/java/com/ferreteria/repository/business/ProductoRepository.java
package com.ferreteria.repository.business;

import com.ferreteria.entities.business.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Este método es clave para nuestra lógica de negocio.
    // Busca un producto por su nombre y marca.
    Optional<Producto> findByNombreAndMarca(String nombre, String marca);
}