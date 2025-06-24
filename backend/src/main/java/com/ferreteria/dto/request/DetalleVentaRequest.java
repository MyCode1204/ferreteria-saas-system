// src/main/java/com/ferreteria/dto/request/DetalleVentaRequest.java
package com.ferreteria.dto.request;

import lombok.Data;

@Data
public class DetalleVentaRequest {
    private Long productoId;
    private int cantidad;
}