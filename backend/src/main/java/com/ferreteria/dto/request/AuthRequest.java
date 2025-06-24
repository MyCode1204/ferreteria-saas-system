// Ubicación: src/main/java/com/ferreteria/dto/request/AuthResponse.java
package com.ferreteria.dto.request;
import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}
