package com.example.Servify.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.Servify.dto.BackendResponse;

@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(UserDoesntExist.class)
    public ResponseEntity<BackendResponse> userDoesntExists() {
        return ResponseEntity
                .badRequest()
                .body(new BackendResponse(false, "User doesnt exists"));
    }

    @ExceptionHandler(SkillDoesntExist.class)
    public ResponseEntity<BackendResponse> skillDoesntExists() {
        return ResponseEntity
                .badRequest()
                .body(new BackendResponse(false, "Skill doesnt exists"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<BackendResponse> runtimeExceptionHandler(RuntimeException e) {
        return ResponseEntity
                .badRequest()
                .body(new BackendResponse(false, e.getMessage()));
    }
}
