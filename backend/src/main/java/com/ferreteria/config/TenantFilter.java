package com.ferreteria.config;

import com.ferreteria.tenant.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(1) // Se ejecuta antes que los filtros de seguridad de Spring
@Slf4j
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Condición mejorada: la ruta debe ser de inquilino Y NO de superadmin.
        boolean isTenantRoute = (path.startsWith("/api/app/") || path.startsWith("/api/auth/"))
                && !path.startsWith("/api/auth/superadmin/");

        if (isTenantRoute) {
            String tenantId = null;

            // Estrategia 1: Identificar por Cabecera (Ideal para Postman/pruebas)
            String tenantFromHeader = request.getHeader("X-Tenant-ID");
            if (tenantFromHeader != null && !tenantFromHeader.isEmpty()) {
                tenantId = tenantFromHeader;
                log.info("TenantFilter: Inquilino identificado por CABECERA: {}", tenantId);
            }

            // Estrategia 2: Identificar por Subdominio (Ideal para Producción)
            if (tenantId == null) {
                String serverName = request.getServerName();
                String[] parts = serverName.split("\\.");

                if (parts.length > 1 && !parts[0].equalsIgnoreCase("www") && !parts[0].equalsIgnoreCase("localhost")) {
                    tenantId = parts[0];
                    log.info("TenantFilter: Inquilino identificado por SUBDOMINIO: {}", tenantId);
                }
            }

            // Validación Final
            if (tenantId == null) {
                log.warn("TenantFilter: No se pudo identificar al inquilino para la ruta: {}. Se requiere la cabecera X-Tenant-ID o un subdominio válido.", path);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("Error: No se pudo identificar al inquilino. Se requiere la cabecera X-Tenant-ID o un subdominio valido.");
                return; // Detenemos la cadena de filtros
            }

            // Aplicar contexto y continuar
            try {
                TenantContext.setCurrentTenant(tenantId);
                filterChain.doFilter(request, response);
            } finally {
                // Es crucial limpiar el contexto para no afectar a otras peticiones.
                TenantContext.clear();
            }

        } else {
            // Para todas las demás rutas (superadmin, general, etc.), no hacemos nada y solo continuamos.
            log.trace("TenantFilter: Omitiendo la lógica de inquilino para la ruta: {}", path);
            filterChain.doFilter(request, response);
        }
    }
}
