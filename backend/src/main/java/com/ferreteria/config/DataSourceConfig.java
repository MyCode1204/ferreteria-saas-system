// Ubicación: src/main/java/com/ferreteria/config/DataSourceConfig.java
package com.ferreteria.config;

import com.ferreteria.tenant.TenantAwareDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.flyway.FlywayDataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.util.HashMap;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${app.datasource.master.url}")
    private String masterUrl;

    @Value("${app.datasource.master.username}")
    private String masterUsername;

    @Value("${app.datasource.master.password}")
    private String masterPassword;

    @Value("${app.datasource.master.driver-class-name}")
    private String masterDriverClassName;

    /**
     * Este es el DataSource para la base de datos maestra.
     * La anotación @FlywayDataSource le dice a Flyway que use ESTE para las migraciones,
     * rompiendo cualquier ciclo de dependencia.
     */
    @Bean(name = "masterDataSource")
    @FlywayDataSource
    public DataSource masterDataSource() {
        logger.info("Creating master DataSource for general use AND Flyway with URL: {}", masterUrl);
        return DataSourceBuilder.create()
                .driverClassName(masterDriverClassName)
                .url(masterUrl)
                .username(masterUsername)
                .password(masterPassword)
                .build();
    }

    /**
     * Este es nuestro DataSource de enrutamiento principal.
     * Se crea VACÍO, solo con la conexión por defecto.
     * Será poblado DESPUÉS de que la aplicación arranque.
     */
    @Bean(name = "routingDataSource")
    @Primary
    public TenantAwareDataSource routingDataSource(@Qualifier("masterDataSource") DataSource masterDataSource) {
        logger.info("Creating EMPTY routing DataSource. It will be populated by TenantDataSourceInitializer after startup.");
        TenantAwareDataSource routingDataSource = new TenantAwareDataSource();
        routingDataSource.setTargetDataSources(new HashMap<>());
        routingDataSource.setDefaultTargetDataSource(masterDataSource);
        return routingDataSource;
    }
}