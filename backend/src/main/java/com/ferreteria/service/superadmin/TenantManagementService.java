// Ubicación: src/main/java/com/ferreteria/service/superadmin/TenantManagementService.java
package com.ferreteria.service.superadmin;

import com.ferreteria.dto.request.CreateTenantRequest;
import com.ferreteria.entities.tenant.Tenant;
import com.ferreteria.repository.superadmin.TenantRepository;
import com.ferreteria.tenant.TenantAwareDataSource;
import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.jdbc.core.JdbcTemplate; // ¡IMPORTANTE!
import org.springframework.security.crypto.password.PasswordEncoder; // ¡IMPORTANTE!
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TenantManagementService {

    private static final Logger logger = LoggerFactory.getLogger(TenantManagementService.class);

    private final TenantRepository tenantRepository;
    private final DataSource dataSource;
    private final TenantAwareDataSource tenantAwareDataSource;
    private final PasswordEncoder passwordEncoder; // <-- INYECTAR PASSWORD ENCODER

    @Value("${app.datasource.master.driver-class-name}")
    private String masterDriverClassName;

    @Value("${app.datasource.master.url}")
    private String masterUrl;

    public TenantManagementService(TenantRepository tenantRepository,
                                   @Qualifier("masterDataSource") DataSource dataSource,
                                   TenantAwareDataSource tenantAwareDataSource,
                                   PasswordEncoder passwordEncoder) { // <-- MODIFICAR CONSTRUCTOR
        this.tenantRepository = tenantRepository;
        this.dataSource = dataSource;
        this.tenantAwareDataSource = tenantAwareDataSource;
        this.passwordEncoder = passwordEncoder; // <-- AÑADIR
    }

    @Transactional
    public Tenant createTenant(CreateTenantRequest request) {
        String tenantId = request.getCompanyName().toLowerCase().replaceAll("\\s+", "-");
        String dbName = "db_" + tenantId.replaceAll("-", "_");
        String dbUser = "user_" + tenantId.replaceAll("-", "_");
        String dbPassword = "password_" + UUID.randomUUID().toString().substring(0, 8);

        if (tenantRepository.existsByTenantId(tenantId)) {
            throw new RuntimeException("El inquilino con id '" + tenantId + "' ya existe.");
        }

        // 1. Guardar la información del inquilino (sin cambios)
        Tenant newTenant = new Tenant();
        //... (setters de newTenant se mantienen igual)
        newTenant.setId(UUID.randomUUID());
        newTenant.setTenantId(tenantId);
        newTenant.setCompanyName(request.getCompanyName());
        newTenant.setDbName(dbName);
        newTenant.setDbUser(dbUser);
        newTenant.setDbPassword(dbPassword);
        newTenant.setSubscriptionPlan("PREMIUM");
        newTenant.setSubscriptionStartDate(LocalDate.now());
        newTenant.setSubscriptionEndDate(LocalDate.now().plusYears(1));
        newTenant.setActive(true);
        Tenant savedTenant = tenantRepository.save(newTenant);
        logger.info("Inquilino '{}' guardado en la tabla 'tenants'", tenantId);

        // 2. Crear la base de datos y el usuario (sin cambios)
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            statement.executeUpdate("CREATE USER " + dbUser + " WITH PASSWORD '" + dbPassword + "'");
            statement.executeUpdate("CREATE DATABASE " + dbName + " WITH OWNER " + dbUser);
            logger.info("Base de datos '{}' y usuario '{}' provisionados.", dbName, dbUser);
        } catch (Exception e) {
            tenantRepository.deleteById(savedTenant.getId());
            throw new RuntimeException("Error al provisionar la BD o el usuario: " + e.getMessage(), e);
        }

        String tenantUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1) + dbName;

        // 3. Ejecutar las migraciones de Flyway (sin cambios)
        try {
            logger.info("Ejecutando migraciones de Flyway para el nuevo inquilino '{}'...", tenantId);
            Flyway.configure()
                    .dataSource(tenantUrl, dbUser, dbPassword)
                    .locations("classpath:db/migration/tenant")
                    .load()
                    .migrate();
            logger.info("Migraciones para '{}' completadas. El esquema está listo.", tenantId);
        } catch(Exception e) {
            logger.error("¡FALLO CRÍTICO! Las migraciones para el inquilino {} fallaron.", tenantId, e);
            throw new RuntimeException("Error al ejecutar migraciones para el nuevo inquilino: " + e.getMessage(), e);
        }

        // 4. ¡NUEVO! Crear el usuario administrador en la BD del inquilino
        try {
            logger.info("Creando el usuario administrador para el inquilino '{}'...", tenantId);
            DataSource tenantDataSource = DataSourceBuilder.create()
                    .driverClassName(masterDriverClassName)
                    .url(tenantUrl)
                    .username(dbUser)
                    .password(dbPassword)
                    .build();

            JdbcTemplate tenantJdbcTemplate = new JdbcTemplate(tenantDataSource);
            String hashedPassword = passwordEncoder.encode(request.getAdminPassword());
            String sql = "INSERT INTO usuario (nombre, username, password, rol) VALUES (?, ?, ?, ?)";

            tenantJdbcTemplate.update(sql, request.getAdminName(), request.getAdminUsername(), hashedPassword, "ADMIN");

            logger.info("Usuario administrador '{}' creado exitosamente en la BD '{}'.", request.getAdminUsername(), dbName);

            // 5. ¡CRUCIAL! Añadir el DataSource al router para que esté disponible en vivo
            logger.info("Añadiendo el nuevo DataSource para '{}' al router de conexiones...", tenantId);
            tenantAwareDataSource.addDataSource(tenantId, tenantDataSource);
            logger.info("DataSource para '{}' añadido exitosamente. ¡El inquilino está 100% operativo!", tenantId);
        } catch (Exception e) {
            logger.error("Error crítico al crear el usuario admin o al añadir el datasource para '{}': {}", tenantId, e.getMessage());
            // Aquí deberías considerar una lógica de rollback más compleja si esto falla
            throw new RuntimeException("La BD se creó pero no se pudo configurar el usuario admin: " + e.getMessage(), e);
        }
        return savedTenant;
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAllByIsActive(true);
    }
}