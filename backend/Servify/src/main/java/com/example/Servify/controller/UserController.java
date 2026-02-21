package com.example.Servify.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.UsersDto;
import com.example.Servify.model.SkillLevel;
import com.example.Servify.service.UserService;


@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<BackendResponse> findAllUsers() {
        List<UsersDto> users = userService.findAllUsers();

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, users));
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<BackendResponse> findByUsername(@PathVariable String username) {
        UsersDto user = userService.findByUsername(username);

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, user));
    }

    @GetMapping("/skills/{username}")
    public ResponseEntity<BackendResponse> findSkills(@PathVariable String username) {
        List<SkillLevel> usersSkills = userService.getUsersSkills(username);

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, usersSkills));

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

    @GetMapping("/get-self")
    public ResponseEntity<BackendResponse> getSelfUser() {
        UsersDto selfUser = userService.getSelfUser();

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, selfUser));
    }

    @GetMapping("/find/staff/{skillId}")
    public ResponseEntity<BackendResponse> findStaffBySkill(@PathVariable String skillId) {
        List<UsersDto> userWithSkill = userService.getStaffBySkill(skillId);
        return ResponseEntity.ok().body(new BackendResponse(true, userWithSkill));
    }


}
