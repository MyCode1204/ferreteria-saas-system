// src/main/java/com/ferreteria/config/WebSocketConfig.java
package com.ferreteria.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Prefijo para los mensajes que van del servidor al cliente
        config.enableSimpleBroker("/topic");
        // Prefijo para los mensajes que van del cliente al servidor
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint que los clientes usarán para conectarse al WebSocket
        registry.addEndpoint("/ws-ferreteria").setAllowedOriginPatterns("*").withSockJS();
    }
}