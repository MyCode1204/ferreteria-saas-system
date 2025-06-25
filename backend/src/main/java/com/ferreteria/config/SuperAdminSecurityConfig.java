package com.ferreteria.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SuperAdminSecurityConfig {

    @Bean
    public AuthenticationProvider superAdminAuthenticationProvider(
            @Qualifier("usuarioMasterDetailsService") UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean(name = "superAdminAuthenticationManager")
    public AuthenticationManager superAdminAuthenticationManager(
            @Qualifier("superAdminAuthenticationProvider") AuthenticationProvider superAdminAuthenticationProvider) {
        return new ProviderManager(superAdminAuthenticationProvider);
    }
}