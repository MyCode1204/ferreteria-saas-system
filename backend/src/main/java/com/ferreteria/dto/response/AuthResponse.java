// Ubicación: src/main/java/com/ferreteria/dto/response/AuthResponse.java
package com.ferreteria.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}