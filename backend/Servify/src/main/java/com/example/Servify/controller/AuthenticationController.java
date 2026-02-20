package com.example.Servify.controller;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.LoginDto;
import com.example.Servify.model.Users;
import com.example.Servify.service.AuthService;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthService authService;
    public AuthenticationController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register/admin")
    public ResponseEntity<BackendResponse> registerAdmin(@RequestBody Users user) {
        String message = authService.registerAdmin(user);
        return ResponseEntity.ok().body(new BackendResponse(true,message));
    }

    @PostMapping("/register/user")
    public ResponseEntity<BackendResponse> registerUser(@RequestBody Users user) {
        String message = authService.registerUser(user);
        return ResponseEntity.ok().body(new BackendResponse(true,message));
    }

    @PostMapping(value = "/register/staff",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BackendResponse> staffRegister(@RequestPart("user") Users user,@RequestPart("image") MultipartFile image) throws IOException {
        String message = authService.registerStaff(user, image);
        return ResponseEntity.ok().body(new BackendResponse(true,message));
    }

    @PostMapping("/login")
    public ResponseEntity<BackendResponse> loginUser(@RequestBody LoginDto user) {
        String message = authService.loginUser(user);
        return ResponseEntity.ok().body(new BackendResponse(true,message));
    }
    
}
