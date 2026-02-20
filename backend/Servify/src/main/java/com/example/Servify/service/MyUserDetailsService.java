package com.example.Servify.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;


@Service
public class MyUserDetailsService implements UserDetailsService{

    private final UserRepo userRepo;

    public MyUserDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        Users user = userRepo.findByUsername(username);
        if (user == null){
            throw new RuntimeException("User not found");
        }
        return user;
    }
    
}
