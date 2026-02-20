package com.example.Servify.controller;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.model.Skill;
import com.example.Servify.service.SkillServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SkillController {

    private final SkillServices skillServices;


    public SkillController(SkillServices skillServices) {
        this.skillServices = skillServices;
    }

    @GetMapping("/skills")
    public ResponseEntity<BackendResponse> findAllSkills() {
        List<Skill> skills = skillServices.findAllSkills();

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(new BackendResponse(true, skills));
    }
}
