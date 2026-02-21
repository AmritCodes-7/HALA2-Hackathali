package com.example.Servify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.PyPrompt;
import com.example.Servify.dto.PyResponse;


@RestController
@RequestMapping("/api/v1")
public class ChatBotController {

    @Autowired RestTemplate restTemplate;

    private final String fastUrl = "http://0.0.0.0:8000/chatbot";
    
    @PostMapping("/chatbot")
    public ResponseEntity<BackendResponse> sendPrompt(@RequestBody PyPrompt prompt) {
        PyResponse response = restTemplate.postForObject(fastUrl, prompt, PyResponse.class);
        return ResponseEntity.ok().body(new BackendResponse(true,response));
    }
    

}
