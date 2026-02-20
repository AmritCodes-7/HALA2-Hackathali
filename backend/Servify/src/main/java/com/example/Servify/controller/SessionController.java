package com.example.Servify.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.dto.OnlineUserDto;
import com.example.Servify.dto.SessionDto;
import com.example.Servify.service.SessionService;

@RestController
@RequestMapping("/api/v1/session")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    /**
     * POST /api/v1/session/heartbeat
     * Frontend calls this periodically (every 60s) with current lat/lng.
     * Marks user as online and updates their location.
     */
    @PostMapping("/heartbeat")
    public ResponseEntity<BackendResponse> heartbeat(@RequestBody SessionDto dto) {
        String message = sessionService.updateLocation(dto);
        return ResponseEntity.ok(new BackendResponse(true, message));
    }

    /**
     * POST /api/v1/session/logout
     * Frontend calls this on logout to mark user offline immediately.
     */
    @PostMapping("/logout")
    public ResponseEntity<BackendResponse> logout() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        sessionService.markOffline(username);
        return ResponseEntity.ok(new BackendResponse(true, "Session ended"));
    }

    /**
     * GET /api/v1/session/online
     * Returns all currently online users.
     */
    @GetMapping("/online")
    public ResponseEntity<BackendResponse> getOnlineUsers() {
        List<OnlineUserDto> users = sessionService.getOnlineUsers();
        return ResponseEntity.ok(new BackendResponse(true, users));
    }

    /**
     * GET /api/v1/session/nearby-staff?lat=27.7&lng=85.3&radius=10&skill=Plumbing
     * Returns online staff near a location, optionally filtered by skill.
     * radius is in km, defaults to 10km.
     */
    @GetMapping("/nearby-staff")
    public ResponseEntity<BackendResponse> getNearbyStaff(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double radius,
            @RequestParam(required = false) String skill) {

        List<OnlineUserDto> staff = sessionService.getNearbyStaff(lat, lng, radius, skill);
        return ResponseEntity.ok(new BackendResponse(true, staff));
    }
}
