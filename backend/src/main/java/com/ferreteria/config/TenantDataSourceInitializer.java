// Ubicación: src/main/java/com/ferreteria/config/TenantDataSourceInitializer.java
package com.ferreteria.config;

import com.ferreteria.tenant.TenantAwareDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Component
public class TenantDataSourceInitializer {

    private static final Logger logger = LoggerFactory.getLogger(TenantDataSourceInitializer.class);

    private final TenantAwareDataSource tenantAwareDataSource;
    private final DataSource masterDataSource;

    @Value("${app.datasource.master.driver-class-name}")
    private String masterDriverClassName;

    public TenantDataSourceInitializer(TenantAwareDataSource tenantAwareDataSource,
                                       @Qualifier("masterDataSource") DataSource masterDataSource) {
        this.tenantAwareDataSource = tenantAwareDataSource;
        this.masterDataSource = masterDataSource;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void initializeTenantDataSources() throws SQLException {
        logger.info("--- INICIALIZANDO CONEXIONES PARA INQUILINOS ---");

        String masterUrl = masterDataSource.getConnection().getMetaData().getURL();
        JdbcTemplate jdbcTemplate = new JdbcTemplate(masterDataSource);
        List<Map<String, Object>> tenants = jdbcTemplate.queryForList("SELECT * FROM tenants WHERE is_active = true");

        logger.info("Encontrados {} inquilinos activos. Configurando sus DataSources...", tenants.size());

        for (Map<String, Object> tenant : tenants) {
            String tenantId = (String) tenant.get("tenant_id");
            String dbName = (String) tenant.get("db_name");
            String dbUser = (String) tenant.get("db_user");
            String dbPassword = (String) tenant.get("db_password");

            // Construir la URL de la base de datos del inquilino
            // Asume que la URL maestra es como "jdbc:postgresql://host:port/master_db"
            String tenantUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1) + dbName;

            try {
                logger.info("Configurando DataSource para inquilino: '{}' con BD: '{}'", tenantId, dbName);

                DataSource tenantDataSource = DataSourceBuilder.create()
                        .driverClassName(masterDriverClassName)
                        .url(tenantUrl)
                        .username(dbUser)
                        .password(dbPassword)
                        .build();

                // Añadimos el nuevo DataSource al router
                tenantAwareDataSource.addDataSource(tenantId, tenantDataSource);
                logger.info("DataSource para '{}' añadido correctamente al pool de conexiones.", tenantId);

            } catch (Exception e) {
                logger.error("Error configurando el DataSource para el inquilino '{}': {}", tenantId, e.getMessage());
                // Considera qué hacer si una conexión falla. ¿Continuar? ¿Detener la app?
            }
        }
        logger.info("--- INICIALIZACIÓN DE CONEXIONES DE INQUILINOS COMPLETADA ---");
    }
}