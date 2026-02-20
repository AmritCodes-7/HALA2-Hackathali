package com.example.Servify.service;

import com.example.Servify.model.Skill;
import com.example.Servify.repository.SkillRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServices {

    private final SkillRepo skillRepo;

    public SkillServices(SkillRepo skillRepo) {
        this.skillRepo = skillRepo;
    }

    public List<Skill> findAllSkills() {
        return skillRepo.findAll();
    }


}
