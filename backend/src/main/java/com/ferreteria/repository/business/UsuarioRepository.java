// Ubicación: src/main/java/com/ferreteria/repository/business/UsuarioRepository.java
package com.ferreteria.repository.business;

import com.ferreteria.entities.business.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Para validar que no se repitan usuarios.
    Optional<Usuario> findByUsername(String username);
}