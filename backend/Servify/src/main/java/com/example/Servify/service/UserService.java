package com.example.Servify.service;

import com.example.Servify.exceptions.UserAlreadyExists;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public void signupNewUser(Users user) {

        if(userRepo.existsByUsername(user)){
            throw new UserAlreadyExists();
        }
        userRepo.save(user);
    }

}
