// src/main/java/com/ferreteria/controller/business/UsuarioController.java
package com.ferreteria.controller.business;

import com.ferreteria.entities.business.Usuario;
import com.ferreteria.repository.business.UsuarioRepository;
import com.ferreteria.service.business.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Toda la clase requiere rol de ADMIN
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        usuarios.forEach(u -> u.setPassword(null)); // Nunca devolver la contraseña
        return usuarios;
    }

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario usuarioCreado = usuarioService.crearUsuario(usuario);
        usuarioCreado.setPassword(null);
        return new ResponseEntity<>(usuarioCreado, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/rol")
    public ResponseEntity<Usuario> cambiarRol(@PathVariable Long id, @RequestBody String rol) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setRol(rol);
                    usuarioRepository.save(usuario);
                    usuario.setPassword(null);
                    return ResponseEntity.ok(usuario);
                }).orElse(ResponseEntity.notFound().build());
    }
}