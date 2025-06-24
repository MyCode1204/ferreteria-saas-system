// Ubicación: src/main/java/com/ferreteria/service/business/UsuarioService.java
package com.ferreteria.service.business;

import com.ferreteria.entities.business.Usuario;
import com.ferreteria.repository.business.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario crearUsuario(Usuario usuario) {
        // Validamos que el username no exista
        usuarioRepository.findByUsername(usuario.getUsername()).ifPresent(u -> {
            throw new IllegalStateException("El nombre de usuario '" + u.getUsername() + "' ya está en uso.");
        });

        // Hasheamos la contraseña antes de guardarla
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        System.out.println("LOGICA DE NEGOCIO: Creando usuario y hasheando contraseña.");
        return usuarioRepository.save(usuario);
    }
}