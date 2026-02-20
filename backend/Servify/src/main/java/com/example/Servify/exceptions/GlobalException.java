package com.example.Servify.exceptions;

import com.example.Servify.dto.BackendResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(UserDoesntExist.class)
    public ResponseEntity<BackendResponse> userAlreadyExists() {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new BackendResponse(false, "User already exists"));
    }
}
