// src/main/java/com/ferreteria/repository/business/EgresoRepository.java
package com.ferreteria.repository.business;

import com.ferreteria.entities.business.Egreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EgresoRepository extends JpaRepository<Egreso, Long> {}