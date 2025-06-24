// Ubicación: src/main/java/com/ferreteria/controller/GeneralController.java
package com.ferreteria.controller;

import com.ferreteria.entities.tenant.Tenant;
import com.ferreteria.repository.superadmin.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/general")
@RequiredArgsConstructor
public class GeneralController {

    private final TenantRepository tenantRepository;

    /**
     * Endpoint público para verificar si un tenantId existe.
     * Esto es crucial para que el frontend pueda decidir si renderizar el login
     * o redirigir a la página principal.
     */
    @GetMapping("/tenants/exists/{tenantId}")
    public ResponseEntity<Boolean> checkTenantExists(@PathVariable String tenantId) {
        boolean exists = tenantRepository.existsByTenantId(tenantId);
        return ResponseEntity.ok(exists);
    }

    /**
     * Endpoint público para obtener la lista de todas las empresas activas.
     * Se usa en la página de aterrizaje.
     * No se exponen datos sensibles.
     */
    @GetMapping("/tenants")
    public ResponseEntity<List<TenantInfo>> getActiveTenants() {
        List<Tenant> activeTenants = tenantRepository.findAllByIsActive(true);
        List<TenantInfo> tenantInfos = activeTenants.stream()
                .map(tenant -> new TenantInfo(tenant.getCompanyName(), tenant.getTenantId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(tenantInfos);
    }

    // DTO simple para no exponer toda la entidad Tenant
    @RequiredArgsConstructor
    private static class TenantInfo {
        public final String companyName;
        public final String tenantId;
    }
}