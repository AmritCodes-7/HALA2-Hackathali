package com.example.Servify.controller;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.UsersDto;
import com.example.Servify.model.SkillLevel;
import com.example.Servify.model.Users;
import com.example.Servify.service.UserService;
import org.springframework.http.HttpRange;
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
        List<UsersDto> users = userService.findAllUsers();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(new BackendResponse(true, users));
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<BackendResponse> findByUsername(@PathVariable String username) {
        UsersDto user = userService.findByUsername(username);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(new BackendResponse(true, user));
    }

    @GetMapping("/{skillname}")
    public ResponseEntity<BackendResponse> findBySkillName(@PathVariable String skillname) {

        List<UsersDto> users = userService.findUserWithSkill(skillname);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(new BackendResponse(true, users));
    }

    @PostMapping("/addskills")
    public ResponseEntity<BackendResponse> addSkillToUser(@RequestBody SkillLevel skill) {
        userService.addSkillsToUser(skill);

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, "Added a new skill"));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<BackendResponse> deleteUser() {
        userService.deleteUser();

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, "Deleted Successfully"));
    }


}
