package com.example.Servify.dto;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OnlineUserDto {
    private String username;
    private String role;
    private Double latitude;
    private Double longitude;
    private boolean online;
    private Instant lastSeen;
    private List<String> skillNames;
    private Double distanceKm; // calculated server-side when filtering nearby
}
