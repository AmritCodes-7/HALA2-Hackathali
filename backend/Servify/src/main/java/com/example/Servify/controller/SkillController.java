package com.example.Servify.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.SkillDto;
import com.example.Servify.service.SkillServices;

@RestController
@RequestMapping("/api/skill")
public class SkillController {

    private final SkillServices skillServices;


    public SkillController(SkillServices skillServices) {
        this.skillServices = skillServices;
    }

    @GetMapping
    public ResponseEntity<BackendResponse> findAllSkills() {
        List<SkillDto> skills = skillServices.findAllSkills();

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, skills));
    }

    @PostMapping
    public ResponseEntity<BackendResponse> addNewSkill(@RequestBody SkillDto skillDto) {
        skillServices.addNewSkill(skillDto);

        return ResponseEntity
                .ok()
                .body(new BackendResponse(true, "Added"));
    }
}
