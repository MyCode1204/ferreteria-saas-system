// src/main/java/com/ferreteria/service/business/NotificationService.java
package com.ferreteria.service.business;

import com.ferreteria.dto.response.StockNotification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendStockLowNotification(String tenantId, StockNotification notification) {
        // Enviamos la notificación a un "topic" específico del inquilino
        String destination = "/topic/" + tenantId + "/stock-low";
        messagingTemplate.convertAndSend(destination, notification);
        System.out.println("Notificación de stock bajo enviada a: " + destination);
    }
}