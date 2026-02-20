package com.example.Servify.dto;

import lombok.Data;

@Data
public class PyValidateResponse {
    
    private String username;

    private boolean result;

    public boolean getResult(){
        return result;
    }

}
