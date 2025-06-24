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
@Order(1)
@Slf4j
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Solo aplicamos la lógica de inquilino a las rutas de la app y de auth
        if (request.getRequestURI().startsWith("/api/app/") || request.getRequestURI().startsWith("/api/auth/")) {

            String tenantId = null;

            // --- ESTRATEGIA 1: Identificar por Cabecera (Ideal para Postman) ---
            String tenantFromHeader = request.getHeader("X-Tenant-ID");
            if (tenantFromHeader != null && !tenantFromHeader.isEmpty()) {
                tenantId = tenantFromHeader;
                log.info("TenantFilter: Inquilino identificado por CABECERA: {}", tenantId);
            }

            // --- ESTRATEGIA 2: Identificar por Subdominio (Ideal para Producción) ---
            if (tenantId == null) {
                // request.getServerName() devuelve, por ejemplo, "compania-chavez.ferreteria.doc"
                String serverName = request.getServerName();
                String[] parts = serverName.split("\\.");

                // Si el dominio tiene al menos 2 partes (ej. "algo.com") y la primera no es "www" o "localhost"
                if (parts.length > 1 && !parts[0].equalsIgnoreCase("www") && !parts[0].equalsIgnoreCase("localhost")) {
                    tenantId = parts[0];
                    log.info("TenantFilter: Inquilino identificado por SUBDOMINIO: {}", tenantId);
                }
            }

            // --- VALIDACIÓN FINAL ---
            if (tenantId == null) {
                // Si después de ambas estrategias no encontramos nada, devolvemos un error.
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("Error: No se pudo identificar al inquilino. Se requiere la cabecera X-Tenant-ID o un subdominio valido.");
                return;
            }

            // --- APLICAR CONTEXTO Y CONTINUAR ---
            try {
                TenantContext.setCurrentTenant(tenantId);
                filterChain.doFilter(request, response);
            } finally {
                // Limpiamos el contexto al final de la petición para no afectar a otras.
                TenantContext.clear();
            }

        } else {
            // Para otras rutas (ej. /api/superadmin), no hacemos nada y solo continuamos.
            filterChain.doFilter(request, response);
        }
    }
}