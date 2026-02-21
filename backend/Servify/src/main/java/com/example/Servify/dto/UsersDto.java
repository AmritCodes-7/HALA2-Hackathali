package com.example.Servify.dto;

import java.util.Date;
import java.util.List;

import com.example.Servify.model.SkillLevel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersDto {

    private String username;
    private String role;
    private Date dateOfBirth;
    private List<SkillLevel> skills;
    private String certificateUrl;
    private String phoneNumber;

}
