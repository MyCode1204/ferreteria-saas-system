// src/main/java/com/ferreteria/controller/business/CajaController.java
package com.ferreteria.controller.business;

import com.ferreteria.entities.business.Egreso;
import com.ferreteria.entities.business.Ingreso;
import com.ferreteria.repository.business.EgresoRepository;
import com.ferreteria.repository.business.IngresoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app/caja")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'CAJERO')")
public class CajaController {

    private final IngresoRepository ingresoRepository;
    private final EgresoRepository egresoRepository;

    @GetMapping("/ingresos")
    public List<Ingreso> listarIngresos() {
        return ingresoRepository.findAll();
    }

    @PostMapping("/ingresos")
    public Ingreso registrarIngreso(@RequestBody Ingreso ingreso) {
        return ingresoRepository.save(ingreso);
    }

    @GetMapping("/egresos")
    public List<Egreso> listarEgresos() {
        return egresoRepository.findAll();
    }

    @PostMapping("/egresos")
    public Egreso registrarEgreso(@RequestBody Egreso egreso) {
        return egresoRepository.save(egreso);
    }
}