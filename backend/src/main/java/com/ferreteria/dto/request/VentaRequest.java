// src/main/java/com/ferreteria/dto/request/VentaRequest.java
package com.ferreteria.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class VentaRequest {
    private Long clienteId;
    private String metodoPago;
    private List<DetalleVentaRequest> detalles;
}