package com.ferreteria.service.superadmin;

import com.ferreteria.repository.superadmin.UsuarioMasterRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service("usuarioMasterDetailsService")
public class UsuarioMasterDetailsService implements UserDetailsService {

    private final UsuarioMasterRepository usuarioMasterRepository;

    public UsuarioMasterDetailsService(UsuarioMasterRepository usuarioMasterRepository) {
        this.usuarioMasterRepository = usuarioMasterRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioMasterRepository.findByUsername(username)
                .map(user -> new User(
                        user.getUsername(),
                        user.getPassword(),
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                ))
                .orElseThrow(() -> new UsernameNotFoundException("Superadmin no encontrado: " + username));
    }
}