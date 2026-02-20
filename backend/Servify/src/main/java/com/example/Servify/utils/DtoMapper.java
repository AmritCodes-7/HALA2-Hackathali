package com.example.Servify.utils;

import org.springframework.stereotype.Component;

import com.example.Servify.dto.SkillDto;
import com.example.Servify.dto.UsersDto;
import com.example.Servify.model.Skill;
import com.example.Servify.model.Users;

@Component
public class DtoMapper {

    public UsersDto UserToDto(Users users) {
        UsersDto dto = new UsersDto();
        dto.setUsername(users.getUsername());
        dto.setRole(users.getRole());
        dto.setDateOfBirth(users.getDateOfBirth());
        dto.setSkills(users.getSkills());
        dto.setCertificateUrl(users.getCertificateUrl());
        dto.setPhoneNumber(users.getPhoneNumber());
        return dto;
    }

    public SkillDto SkillToDto(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setName(skill.getName());
        dto.setDescription(skill.getDescription());
        return dto;
    }
}
