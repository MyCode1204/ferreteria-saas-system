package com.ferreteria.controller.superadmin;

import com.ferreteria.dto.request.CreateTenantRequest;
import com.ferreteria.entities.tenant.Tenant;
import com.ferreteria.service.superadmin.TenantManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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
    @GetMapping
    public ResponseEntity<List<Tenant>> getTenants() {
        List<Tenant> tenants = tenantService.getAllTenants();
        return ResponseEntity.ok(tenants);
    }

}
