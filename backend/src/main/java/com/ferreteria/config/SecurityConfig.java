// Ubicación: backend/src/main/java/com/ferreteria/config/SecurityConfig.java
package com.ferreteria.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

// --- CORRECCIÓN ---
// Se elimina la anotación duplicada. Solo debe haber UNA @Configuration.
// La propiedad proxyBeanMethods = false soluciona el error de arranque con DevTools.
@Configuration(proxyBeanMethods = false)
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final TenantFilter tenantFilter;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Cadena de seguridad para el Super Administrador.
     * Se aplica PRIMERO (gracias a @Order(1)) a las rutas de superadmin.
     */
    @Bean
    @Order(1)
    public SecurityFilterChain superAdminSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                // Esta cadena de filtros se aplica SÓLO a las rutas que coinciden aquí
                .securityMatcher("/api/auth/superadmin/**", "/api/superadmin/**")
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // El rol aquí es 'SUPER_ADMIN', Spring añade el prefijo 'ROLE_' automáticamente.
                        .requestMatchers("/api/superadmin/**").hasRole("SUPER_ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // El JwtAuthenticationFilter se encarga de validar el token del superadmin
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Cadena de seguridad para los Inquilinos (Tenants).
     * Se aplica DESPUÉS (@Order(2)) a todas las demás rutas que no coincidieron antes.
     */
    @Bean
    @Order(2)
    public SecurityFilterChain tenantSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas no necesitan el X-Tenant-ID
                        .requestMatchers("/api/auth/**", "/ws-ferreteria/**").permitAll()
                        // Todas las demás rutas sí requieren autenticación de inquilino
                        .anyRequest().authenticated()
                )
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider) // Provider para usuarios de inquilinos
                // El orden aquí es CRÍTICO:
                // 1. JwtAuthenticationFilter: Intenta validar el JWT primero.
                // 2. TenantFilter: Si hay un token válido, establece el DataSource del inquilino.
                .addFilterBefore(tenantFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthenticationFilter, TenantFilter.class);

        return http.build();
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Tenant-ID"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}