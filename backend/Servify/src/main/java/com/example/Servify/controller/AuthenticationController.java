package com.example.Servify.controller;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.LoginDto;
import com.example.Servify.dto.LoginResponse;
import com.example.Servify.model.SkillLevel;
import com.example.Servify.model.Users;
import com.example.Servify.service.AuthService;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    @Autowired
    private GridFsTemplate gridfs;


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

    @PostMapping("/register/staff")
    public ResponseEntity<BackendResponse> staffRegister(
        @RequestPart("username") String username,
        @RequestPart("password") String password,
        @RequestPart("dateOfBirth") String dob,
        @RequestPart("skills") String skills,
        @RequestPart("certificate") MultipartFile certificate,
        @RequestPart("phoneNumber") String phoneNumber
    ) throws IOException, ParseException {

         ObjectMapper mapper = new ObjectMapper();
        List<SkillLevel> skill = mapper.readValue(skills, 
            new TypeReference<List<SkillLevel>>() {});
        
        Date dateOfBirth = new SimpleDateFormat("yyyy-MM-dd").parse(dob);
        ObjectId store = gridfs.store(certificate.getInputStream(),certificate.getOriginalFilename(),certificate.getContentType());
        Users user = new Users();
        user.setUsername(username);
        user.setPassword(password);
        user.setDateOfBirth(dateOfBirth);
        user.setSkills(skill);
        user.setPhoneNumber(phoneNumber);
        user.setCertificateUrl("http://localhost:8080/api/v1/image/" + store);
        String message = authService.registerStaff(user);
        return ResponseEntity.ok().body(new BackendResponse(true,message));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginDto user) {
        String token = authService.loginUser(user);
        return ResponseEntity.ok(new LoginResponse(true, token));
    }
    
}
