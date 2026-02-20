package com.example.Servify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.Servify.jwt.JwtAuthFilter;
import com.example.Servify.service.MyUserDetailsService;


@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final MyUserDetailsService myUserDetaisService;
    private final JwtAuthFilter jwtAuthFilter;
    public SecurityConfig( MyUserDetailsService myUserDetaisService, JwtAuthFilter jwtAuthFilter){
        this.myUserDetaisService = myUserDetaisService;
        this.jwtAuthFilter = jwtAuthFilter;
    }
    
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/v1/auth/login/**",
                                    "/api/v1/auth/register/**").permitAll()
                    .requestMatchers("/ws/**").permitAll()        // allow websocket endpoint
                .requestMatchers("/**/*.html").permitAll()    // allow HTML frontend
                .anyRequest().authenticated())
                .csrf(c -> c.disable())
                .cors(Customizer.withDefaults())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
                
    }

    @Bean
    BCryptPasswordEncoder encoder(){
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(myUserDetaisService);
        provider.setPasswordEncoder(new BCryptPasswordEncoder());
        return provider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }

}
