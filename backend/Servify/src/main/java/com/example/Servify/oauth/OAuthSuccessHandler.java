package com.example.Servify.oauth;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.Servify.jwt.JwtUtils;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtils jwtService;
    private final UserRepo userRepository;

    public OAuthSuccessHandler(JwtUtils jwtService, UserRepo userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        String email = authentication.getName(); // Google email
        // if (userRepository.existsByUsername(email)){
        //     throw new RuntimeException("User already exists");
        // }

            // Save new user
            Users user = Users.builder()
                    .username(email)
                    .role("ROLE_USER") 
                    .build();
            userRepository.save(user);

        // Generate JWT
        String token = jwtService.generateToken(user);

        // Redirect frontend with token
        response.sendRedirect("http://localhost:5173/oauth-success?token=" + token);
    }
}