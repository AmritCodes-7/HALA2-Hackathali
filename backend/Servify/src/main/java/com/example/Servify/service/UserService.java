package com.example.Servify.service;

import com.example.Servify.model.Skill;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public List<Users> findAllUsers() {
        return userRepo.findAll();
    }

    public Users findByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public List<Users> findUserWithSkill(String skillname) {
        return userRepo.findBySkillsSkillName(skillname);
    }

}
