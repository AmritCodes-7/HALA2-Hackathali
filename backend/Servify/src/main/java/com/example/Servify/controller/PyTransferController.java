package com.example.Servify.controller;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.PyValidateResponse;
import com.example.Servify.dto.UsersPyDto;
import com.example.Servify.service.PyTransferService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class PyTransferController {

    private final PyTransferService pyTransferService;

    public PyTransferController(PyTransferService pyTransferService) {
        this.pyTransferService = pyTransferService;
    }

    @GetMapping
    public ResponseEntity<BackendResponse> validateCertificate(UsersPyDto dto){
        PyValidateResponse pyValidateResponse = pyTransferService.pyValidateResponse(dto);
        return ResponseEntity.ok().body(new BackendResponse(true,pyValidateResponse));
    }

}
