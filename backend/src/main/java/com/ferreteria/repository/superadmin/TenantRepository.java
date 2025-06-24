// Ubicación: src/main/java/com/ferreteria/repository/superadmin/TenantRepository.java
package com.ferreteria.repository.superadmin;

import com.ferreteria.entities.tenant.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    // Spring Data JPA nos da métodos como save(), findById(), findAll(), etc., ¡gratis!

    /**
     * ¡MÉTODO AÑADIDO!
     * Al declarar este método, Spring Data JPA automáticamente creará la consulta
     * para verificar si un inquilino existe por su campo 'tenantId'.
     * No necesitamos escribir la implementación, Spring lo hace por nosotros.
     */
    boolean existsByTenantId(String tenantId);
}