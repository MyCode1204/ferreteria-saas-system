// Ubicación: src/main/java/com/ferreteria/tenant/TenantContext.java
package com.ferreteria.tenant;

public class TenantContext {
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

    public static void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }

    public static void clear() {
        // Es muy importante limpiar el ThreadLocal al final de cada petición
        // para evitar que se filtren datos a la siguiente petición que use el mismo hilo.
        currentTenant.remove();
    }
}
