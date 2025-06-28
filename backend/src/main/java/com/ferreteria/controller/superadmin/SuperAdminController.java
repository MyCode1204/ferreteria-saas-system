// Ubicación: backend/src/main/java/com/ferreteria/controller/superadmin/SuperAdminController.java
package com.ferreteria.controller.superadmin;

import com.ferreteria.dto.request.CreateTenantRequest;
import com.ferreteria.entities.tenant.Tenant;
import com.ferreteria.service.superadmin.TenantManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/superadmin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final TenantManagementService tenantManagementService;

    @PostMapping("/tenants")
    public ResponseEntity<Tenant> createTenant(@RequestBody CreateTenantRequest request) {
        Tenant createdTenant = tenantManagementService.createTenant(request);
        // Devolvemos el tenant creado con un código de estado 200 OK.
        return ResponseEntity.ok(createdTenant);
    }
}