package com.example.Servify.dto;

// new file: dto/LoginResponse.java
public class LoginResponse {
    private boolean success;
    private String token;

    public LoginResponse(boolean success, String token) {
        this.success = success;
        this.token = token;
    }
    // getters
    public boolean isSuccess() { return success; }
    public String getToken() { return token; }
}