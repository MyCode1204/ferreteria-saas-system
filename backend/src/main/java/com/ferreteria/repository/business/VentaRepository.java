// src/main/java/com/ferreteria/repository/business/VentaRepository.java
package com.ferreteria.repository.business;

import com.ferreteria.entities.business.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {}
