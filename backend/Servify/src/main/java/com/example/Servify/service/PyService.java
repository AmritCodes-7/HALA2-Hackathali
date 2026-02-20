package com.example.Servify.service;

import com.example.Servify.dto.UsersPyDto;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;
import com.example.Servify.utils.DtoMapper;
import org.springframework.stereotype.Service;

@Service
public class PyService {

    private final UserRepo userRepo;
    private final DtoMapper dtoMapper;

    public PyService(UserRepo userRepo, DtoMapper dtoMapper) {
        this.userRepo = userRepo;
        this.dtoMapper = dtoMapper;
    }

    public UsersPyDto getUsersPyDto(String username) {
        Users user = userRepo.findByUsername(username);

        return dtoMapper.UserToPyDto(user);
    }
}
