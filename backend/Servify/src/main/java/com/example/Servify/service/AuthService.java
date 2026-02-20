package com.example.Servify.service;

import java.io.IOException;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Servify.dto.LoginDto;
import com.example.Servify.jwt.JwtUtils;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;



@Service
public class AuthService {
    
    UserRepo userRepo;
    BCryptPasswordEncoder encoder;
    JwtUtils jwtUtils;
    AuthenticationManager authManager;

    public AuthService(UserRepo userRepo, BCryptPasswordEncoder encoder, JwtUtils jwtUtils, AuthenticationManager authManager){
        
        this.userRepo = userRepo;
        this.authManager = authManager;
        this.jwtUtils = jwtUtils;
        this.encoder = encoder;

    }

    public String registerAdmin(Users user){
        if (user.getUsername().isBlank() || user.getPassword().isBlank()){
            throw new RuntimeException("please enter the details");
        }
        if (userRepo.existsByUsername(user.getUsername())){
            throw new RuntimeException("user already exists with that name");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("ROLE_ADMIN");
        userRepo.save(user);
        return "admin registered";
    }

    public String registerUser(Users user){
        if (user.getUsername().isBlank() || user.getPassword().isBlank()){
            throw new RuntimeException("please enter username and password");
        }
        if (userRepo.existsByUsername(user.getUsername())){
            throw new RuntimeException("user already exists with that name");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        userRepo.save(user);
        return "user registered";
    }

    public String registerStaff(Users user) throws IOException{
        if (user.getUsername().isBlank() || user.getPassword().isBlank()){
            throw new RuntimeException("please enter username and password");
        }
        if (userRepo.existsByUsername(user.getUsername())){
            throw new RuntimeException("user already exists with that name");
        } 
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("ROLE_STAFF");
        userRepo.save(user);
        return "user registered";
    }


    public String loginUser(LoginDto user){
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if (authentication.isAuthenticated()){
            Users userOnDB = userRepo.findByUsername(user.getUsername());
            return jwtUtils.generateToken(userOnDB);
        }
        throw new BadCredentialsException("please enter correct credential");
    }


}
