// Ubicación: backend/src/main/java/com/ferreteria/config/JwtAuthenticationFilter.java
package com.ferreteria.config;

import com.ferreteria.service.business.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService tenantUserDetailsService;
    private final UserDetailsService superAdminUserDetailsService;

    // Modificamos el constructor para recibir ambos UserDetailsService
    public JwtAuthenticationFilter(
            JwtService jwtService,
            @Qualifier("userDetailsService") UserDetailsService tenantUserDetailsService,
            @Qualifier("usuarioMasterDetailsService") UserDetailsService superAdminUserDetailsService) {
        this.jwtService = jwtService;
        this.tenantUserDetailsService = tenantUserDetailsService;
        this.superAdminUserDetailsService = superAdminUserDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails;
            String path = request.getRequestURI();

            // ¡AQUÍ ESTÁ LA LÓGICA CLAVE!
            // Decidimos qué servicio usar basándonos en la ruta de la API.
            if (path.startsWith("/api/superadmin/")) {
                userDetails = this.superAdminUserDetailsService.loadUserByUsername(username);
            } else {
                // Para el resto de rutas de app, usamos el servicio de inquilino.
                userDetails = this.tenantUserDetailsService.loadUserByUsername(username);
            }

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}