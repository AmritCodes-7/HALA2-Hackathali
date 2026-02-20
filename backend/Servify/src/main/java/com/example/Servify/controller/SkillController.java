package com.example.Servify.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.SkillDto;
import com.example.Servify.service.SkillServices;

@RestController
@RequestMapping("/api")
public class SkillController {

    private final SkillServices skillServices;


    public SkillController(SkillServices skillServices) {
        this.skillServices = skillServices;
    }

    @GetMapping("/skills")
    public ResponseEntity<BackendResponse> findAllSkills() {
        List<SkillDto> skills = skillServices.findAllSkills();

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, skills));
    }

}
