package com.example.Servify.service;

import com.example.Servify.dto.SkillDto;
import com.example.Servify.exceptions.SkillDoesntExist;
import com.example.Servify.model.Skill;
import com.example.Servify.repository.SkillRepo;
import com.example.Servify.utils.DtoMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServices {

    private final SkillRepo skillRepo;

    public SkillServices(SkillRepo skillRepo) {
        this.skillRepo = skillRepo;
    }

    public List<SkillDto> findAllSkills() {
        return skillRepo.findAll().stream()
                .map(skill -> DtoMapper.SkillToDto(skill, new SkillDto()))
                .toList();
    }

    public SkillDto findSkillsBySkillId(String skillId) {
        if (!skillRepo.existsById(skillId)) {
            throw new SkillDoesntExist();
        }
        Skill skill = skillRepo.findSkillBySkillId(skillId);

        SkillDto skillDto = DtoMapper.SkillToDto(skill, new SkillDto());
        return skillDto;
    }


}
