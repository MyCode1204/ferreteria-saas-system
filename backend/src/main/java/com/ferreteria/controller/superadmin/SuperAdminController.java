package com.ferreteria.controller.superadmin;

import com.ferreteria.dto.request.CreateTenantRequest;
import com.ferreteria.entities.tenant.Tenant;
import com.ferreteria.service.superadmin.TenantManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/superadmin/tenants")
public class SuperAdminController {
    private final TenantManagementService tenantService;

    public SuperAdminController(TenantManagementService tenantService) {
        this.tenantService = tenantService;
    }

    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestBody CreateTenantRequest request) {
        Tenant savedTenant = tenantService.createTenant(request);
        return new ResponseEntity<>(savedTenant, HttpStatus.CREATED);
    }
}
