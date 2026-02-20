package com.example.Servify.service;

import com.example.Servify.dto.UsersDto;
import com.example.Servify.exceptions.UserDoesntExist;
import com.example.Servify.model.Skill;
import com.example.Servify.model.SkillLevel;
import com.example.Servify.model.Users;
import com.example.Servify.repository.SkillRepo;
import com.example.Servify.repository.UserRepo;
import com.example.Servify.utils.DtoMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.Servify.utils.DtoMapper.UserToDto;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final SkillRepo skillRepo;

    public UserService(UserRepo userRepo, SkillRepo skillRepo) {
        this.userRepo = userRepo;
        this.skillRepo = skillRepo;
    }

    public List<UsersDto> findAllUsers() {
        return userRepo.findAll().stream()
                .map(user -> UserToDto(user, new UsersDto()))
                .collect(Collectors.toList());
    }

    public UsersDto findByUsername(String username) {

        if (!userRepo.existsByUsername(username)) {
            throw new UserDoesntExist();
        }
        Users user = userRepo.findByUsername(username);
        return DtoMapper.UserToDto(user, new UsersDto());

    }

    public List<UsersDto> findUserWithSkill(String skillname) {
        return userRepo.findBySkillsSkillName(skillname).stream()
                .map(users -> DtoMapper.UserToDto(users, new UsersDto()))
                .toList();
    }

    public void addSkillsToUser(SkillLevel skill) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepo.findByUsername(username);

        user.getSkills().add(skill);
    }

    public void deleteUserByUsername(String username) {
        if (!userRepo.existsByUsername(username)) {
            throw new UserDoesntExist();
        }

        userRepo.deleteByUsername(username);
    }


}
