// src/main/java/com/ferreteria/repository/business/IngresoRepository.java
package com.ferreteria.repository.business;

import com.ferreteria.entities.business.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, Long> {
}
