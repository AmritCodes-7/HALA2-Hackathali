package com.example.Servify.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.Servify.dto.UsersDto;
import com.example.Servify.exceptions.UserDoesntExist;
import com.example.Servify.model.SkillLevel;
import com.example.Servify.model.Users;
import com.example.Servify.repository.SkillRepo;
import com.example.Servify.repository.UserRepo;
import com.example.Servify.utils.DtoMapper;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final SkillRepo skillRepo;

    @Autowired private DtoMapper dtoMapper;

    public UserService(UserRepo userRepo, SkillRepo skillRepo) {
        this.userRepo = userRepo;
        this.skillRepo = skillRepo;
    }

    public List<UsersDto> findAllUsers() {
        List<Users> allUsers = userRepo.findAll();
        return allUsers.stream().map(user -> dtoMapper.UserToDto(user)).toList();
    }

    public UsersDto findByUsername(String username) {

        if (!userRepo.existsByUsername(username)) {
            throw new UserDoesntExist();
        }
        Users user = userRepo.findByUsername(username);
        return dtoMapper.UserToDto(user);

    }

    public List<UsersDto> findUserWithSkill(String skillId) {
        return userRepo.findBySkillsSkillId(skillId).stream()
                .map(users -> dtoMapper.UserToDto(users))
                .toList();
    }

    public void addSkillsToUser(SkillLevel skill) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepo.findByUsername(username);

        user.getSkills().add(skill);
    }

    public void deleteUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        userRepo.deleteByUsername(username);
    }

    public UsersDto getSelfUser(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
       Users user = userRepo.findByUsername(username);
       UsersDto userToDto = dtoMapper.UserToDto(user);
       return userToDto;
    }


}
