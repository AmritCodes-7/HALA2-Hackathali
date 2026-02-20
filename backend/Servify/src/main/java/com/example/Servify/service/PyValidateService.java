package com.example.Servify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Servify.dto.PyValidateResponse;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;

@Service
public class PyValidateService {

    @Autowired RestTemplate restTemplate;
    @Autowired UserRepo userRepo;

    private String validateUrl = "https://servify-theta.vercel.app/validate-user/";
    
    public String validateStaff(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepo.findByUsername(username);
        if (user.getCertificateUrl() != null){
            PyValidateResponse staffValidatedResponse = restTemplate.getForObject(validateUrl+user.getUsername(), PyValidateResponse.class);
            user.setIsStaffValidated(staffValidatedResponse.getResult());
            return "validated";
        }

        throw new RuntimeException("user doesnt have certificate");
    }

}
