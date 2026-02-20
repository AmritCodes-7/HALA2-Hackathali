package com.example.Servify.controller;


import com.example.Servify.dto.BackendResponse;
import com.example.Servify.model.Users;
import com.example.Servify.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<BackendResponse> findAllUsers() {
        List<Users> users = userService.findAllUsers();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(new BackendResponse(true, users));
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<BackendResponse> findByUsername(@PathVariable String username) {
        Users user = userService.findByUsername(username);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(new BackendResponse(true, user));
    }
}
