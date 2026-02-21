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

    // FIX: was @GetMapping with NO path — mapped to GET /api/v1 (the root!)
    // This intercepted ALL unmatched GET requests to /api/v1, including things
    // like /api/v1/skills which would fall through and hit this instead of SkillController.
    // Added explicit path /py-transfer so it only handles its own endpoint.
    @GetMapping("/py-transfer")
    public ResponseEntity<BackendResponse> validateCertificate(UsersPyDto dto){
        PyValidateResponse pyValidateResponse = pyTransferService.pyValidateResponse(dto);
        return ResponseEntity.ok().body(new BackendResponse(true,pyValidateResponse));
    }
}
