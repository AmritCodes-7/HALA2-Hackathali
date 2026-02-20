package com.example.Servify.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Servify.dto.SkillDto;
import com.example.Servify.exceptions.SkillDoesntExist;
import com.example.Servify.model.Skill;
import com.example.Servify.repository.SkillRepo;
import com.example.Servify.repository.UserRepo;
import com.example.Servify.utils.DtoMapper;

@Service
public class SkillServices {

    private final UserRepo userRepo;

    private final SkillRepo skillRepo;
     
    @Autowired DtoMapper dtoMapper;

    public SkillServices(SkillRepo skillRepo, UserRepo userRepo) {
        this.skillRepo = skillRepo;
        this.userRepo = userRepo;
    }

    public List<SkillDto> findAllSkills() {
        List<Skill> skills = skillRepo.findAll();
        return skills.stream().map(skill -> dtoMapper.SkillToDto(skill)).toList();
    }

    public SkillDto findSkillsBySkillId(String skillId) {
        if (!skillRepo.existsById(skillId)) {
            throw new SkillDoesntExist();
        }
        Skill skill = skillRepo.findSkillBySkillId(skillId);

        SkillDto skillDto = dtoMapper.SkillToDto(skill);
        return skillDto;
    }


}
