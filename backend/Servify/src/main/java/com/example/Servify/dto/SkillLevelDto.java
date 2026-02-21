package com.example.Servify.dto;

import com.example.Servify.model.Skill;
import lombok.Data;

@Data
public class SkillLevelDto {
    private SkillDto skill;
    private int level;
}
