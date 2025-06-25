package com.ferreteria.repository.superadmin;

import com.ferreteria.entities.superadmin.UsuarioMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioMasterRepository extends JpaRepository<UsuarioMaster, Long> {
    Optional<UsuarioMaster> findByUsername(String username);
}