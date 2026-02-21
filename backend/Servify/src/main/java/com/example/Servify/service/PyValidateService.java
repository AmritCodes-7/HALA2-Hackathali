package com.example.Servify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Servify.dto.PyValidateResponse;
import com.example.Servify.dto.UsersPyDto;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;

@Service
public class PyValidateService {

    @Autowired RestTemplate restTemplate;
    @Autowired UserRepo userRepo;

    private String validateUrl = "http://0.0.0.0:8000/validate-user";
    
    public boolean validateStaff(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepo.findByUsername(username);
        UsersPyDto usersPyDto = new UsersPyDto();
        usersPyDto.setUsername(username);
        usersPyDto.setCertificateUrl("http://host.docker.internal:8080/" + user.getCertificateUrl().substring(22));
        usersPyDto.setSkills(user.getSkills().stream().map(skill -> skill.getSkillId()).toList());
        if (user.getCertificateUrl() != null){
            PyValidateResponse staffValidatedResponse = restTemplate.postForObject(validateUrl,usersPyDto, PyValidateResponse.class);
            user.setIsStaffValidated(staffValidatedResponse.getResult());
            userRepo.save(user); // FIX: persist the validation result
            return staffValidatedResponse.getResult();
        }

        throw new RuntimeException("user doesnt have certificate");
    }

}
