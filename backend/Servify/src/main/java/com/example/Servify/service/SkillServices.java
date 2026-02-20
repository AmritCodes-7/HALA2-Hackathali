package com.example.Servify.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Servify.dto.SkillDto;
import com.example.Servify.model.Skill;
import com.example.Servify.repository.SkillRepo;
import com.example.Servify.repository.UserRepo;
import com.example.Servify.utils.DtoMapper;

@Service
public class SkillServices {


    private final SkillRepo skillRepo;

    @Autowired
    DtoMapper dtoMapper;

    public SkillServices(SkillRepo skillRepo) {
        this.skillRepo = skillRepo;
    }

    public List<SkillDto> findAllSkills() {
        List<Skill> skills = skillRepo.findAll();
        return skills.stream().map(skill -> dtoMapper.SkillToDto(skill)).toList();
    }

    public void addNewSkill(SkillDto skillDto) {

        if (skillRepo.existsByName(skillDto.getName())) {
            System.out.println("Skipped adding skills again");
            return;
        }

        Skill skill = new Skill();
        skill.setName(skillDto.getName());
        skill.setDescription(skillDto.getDescription());

        skillRepo.save(skill);
    }

    public String addSkill(Skill skill){
        skillRepo.save(skill);
        return "skill added";
    }


}
