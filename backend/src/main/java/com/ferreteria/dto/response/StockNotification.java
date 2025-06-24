// src/main/java/com/ferreteria/dto/response/StockNotification.java
package com.ferreteria.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StockNotification {
    private Long productoId;
    private String nombreProducto;
    private int stockActual;
    private int stockMinimo;
}