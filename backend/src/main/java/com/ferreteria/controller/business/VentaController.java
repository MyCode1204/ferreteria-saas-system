// src/main/java/com/ferreteria/controller/business/VentaController.java
package com.ferreteria.controller.business;

import com.ferreteria.dto.request.VentaRequest;
import com.ferreteria.entities.business.Venta;
import com.ferreteria.repository.business.VentaRepository;
import com.ferreteria.service.business.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;
    private final VentaRepository ventaRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CAJERO')")
    public ResponseEntity<Venta> registrarVenta(@RequestBody VentaRequest ventaRequest, Authentication authentication) {
        String username = authentication.getName();
        Venta nuevaVenta = ventaService.registrarVenta(ventaRequest, username);
        return new ResponseEntity<>(nuevaVenta, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CAJERO')")
    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CAJERO')")
    public ResponseEntity<Venta> obtenerVentaPorId(@PathVariable Long id) {
        return ventaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}