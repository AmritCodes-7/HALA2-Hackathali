package com.example.Servify.service;

import com.example.Servify.dto.UsersDto;
import com.example.Servify.exceptions.UserDoesntExist;
import com.example.Servify.model.Skill;
import com.example.Servify.model.SkillLevel;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;
import com.example.Servify.utils.UsersDtoMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.Servify.utils.UsersDtoMapper.UserToDto;

@Service
public class UserService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
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
        return UsersDtoMapper.UserToDto(user, new UsersDto());

    }

    public List<Users> findUserWithSkill(String skillname) {
        return userRepo.findBySkillsSkillName(skillname);
    }

    public void addSkillsToUser(SkillLevel skill) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepo.findByUsername(username);

        user.getSkills().add(skill);


    }

}
