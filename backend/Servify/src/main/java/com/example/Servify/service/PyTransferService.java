package com.example.Servify.service;

import com.example.Servify.dto.PyValidateResponse;
import com.example.Servify.dto.UsersPyDto;
import com.example.Servify.model.Users;
import com.example.Servify.utils.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PyTransferService {

    @Autowired
    DtoMapper dtoMapper;

    @Autowired
    RestTemplate restTemplate;

    private final String pyUrl = "http:0.0.0.0:8000/validate-user";

    public PyValidateResponse pyValidateResponse(UsersPyDto usersPyDto){
        return restTemplate.getForObject(pyUrl+usersPyDto.getUsername(), PyValidateResponse.class);
    }
}
