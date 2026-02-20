package com.example.Servify.utils;

import com.example.Servify.dto.UsersDto;
import com.example.Servify.model.Users;

public class UsersDtoMapper {

    public static UsersDto UserToDto(Users users, UsersDto dto) {
        dto.setUsername(users.getUsername());
        dto.setRole(users.getRole());
        dto.setDateOfBirth(users.getDateOfBirth());
        dto.setSkills(users.getSkills());
        dto.setCertificateUrl(users.getCertificateUrl());
        dto.setPhoneNumber(users.getPhoneNumber());

        return dto;
    }
}
