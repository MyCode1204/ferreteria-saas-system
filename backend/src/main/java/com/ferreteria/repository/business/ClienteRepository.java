// Ubicación: src/main/java/com/ferreteria/repository/business/ClienteRepository.java
package com.ferreteria.repository.business;

import com.ferreteria.entities.business.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Para validar que no se repitan clientes por DNI.
    Optional<Cliente> findByDni(String dni);
}
