package com.example.Servify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.service.PyValidateService;


@RestController
@RequestMapping("/api")
public class PyValidateController {

    
    @Autowired PyValidateService pyValidateService;

    @GetMapping("/validate")
    public ResponseEntity<BackendResponse> validateStaff(){
        String message = pyValidateService.validateStaff();
        return ResponseEntity.ok().body(new BackendResponse(true,message));
    }
    

}
