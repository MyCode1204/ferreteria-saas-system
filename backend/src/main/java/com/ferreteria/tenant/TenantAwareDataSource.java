// Ubicación: src/main/java/com/ferreteria/tenant/TenantAwareDataSource.java
package com.ferreteria.tenant;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

public class TenantAwareDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return TenantContext.getCurrentTenant();
    }

    // ¡NUEVO MÉTODO!
    public synchronized void addDataSource(String key, DataSource dataSource) {
        // Obtenemos el mapa actual de DataSources, creamos una copia mutable,
        // añadimos el nuevo y actualizamos el router.
        Map<Object, Object> targetDataSources = new HashMap<>(getResolvedDataSources());
        targetDataSources.put(key, dataSource);
        this.setTargetDataSources(targetDataSources);
        this.afterPropertiesSet(); // Esta llamada es crucial para que el router recargue los DataSources
    }
}