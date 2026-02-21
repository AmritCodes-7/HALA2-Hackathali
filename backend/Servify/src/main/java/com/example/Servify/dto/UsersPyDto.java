package com.example.Servify.dto;

import com.example.Servify.model.SkillLevel;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class UsersPyDto {
    private String username;
    private List<String> skills;
    private String certificateUrl;
}
