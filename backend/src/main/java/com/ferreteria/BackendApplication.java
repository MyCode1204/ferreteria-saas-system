package com.ferreteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
		/*Contraseña Encriptada*/
		/*BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String rawPassword = "chavez120405"; // Reemplaza esto con la contraseña que quieras
		String encodedPassword = passwordEncoder.encode(rawPassword);

		System.out.println("La contraseña encriptada es:");
		System.out.println(encodedPassword);*/
	}

}
