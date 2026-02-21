package com.example.Servify.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.Servify.dto.OnlineUserDto;
import com.example.Servify.dto.SessionDto;
import com.example.Servify.model.Skill;
import com.example.Servify.model.SkillLevel;
import com.example.Servify.model.UserSession;
import com.example.Servify.model.Users;
import com.example.Servify.repository.SessionRepository;
import com.example.Servify.repository.SkillRepo;
import com.example.Servify.repository.UserRepo;

@Service
public class SessionService {

    private final SessionRepository sessionRepo;
    private final UserRepo userRepo;
    private final SkillRepo skillRepo;

    public SessionService(SessionRepository sessionRepo, UserRepo userRepo, SkillRepo skillRepo) {
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
        this.skillRepo = skillRepo;
    }

    // ── Called on login / heartbeat / location update ──────────────────────
    public void upsertSession(String username, Double lat, Double lng) {
        Users user = userRepo.findByUsername(username);
        if (user == null) return;

        // Resolve skill names from the user's SkillLevel list
        List<String> skillNames = resolveSkillNames(user.getSkills());

        UserSession session = sessionRepo.findByUsername(username)
                .orElse(UserSession.builder().username(username).build());

        session.setRole(user.getRole());
        session.setOnline(true);
        session.setLastSeen(Instant.now());
        session.setSkillNames(skillNames);

        if (lat != null) session.setLatitude(lat);
        if (lng != null) session.setLongitude(lng);

        sessionRepo.save(session);
    }

    // ── Called on logout ────────────────────────────────────────────────────
    public void markOffline(String username) {
        sessionRepo.findByUsername(username).ifPresent(s -> {
            s.setOnline(false);
            s.setLastSeen(Instant.now());
            sessionRepo.save(s);
        });
    }

    // ── Update just location (heartbeat) ────────────────────────────────────
    public String updateLocation(SessionDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        upsertSession(username, dto.getLatitude(), dto.getLongitude());
        return "Location updated";
    }

    // ── Get all online users ─────────────────────────────────────────────────
    public List<OnlineUserDto> getOnlineUsers() {
        return sessionRepo.findByOnlineTrue()
                .stream()
                .map(s -> toDto(s, null, null))
                .collect(Collectors.toList());
    }

    // ── Get online STAFF near a location, filtered by skill ─────────────────
    public List<OnlineUserDto> getNearbyStaff(Double lat, Double lng, Double radiusKm, String skillName) {
        List<UserSession> sessions;

        if (skillName != null && !skillName.isBlank()) {
            sessions = sessionRepo.findByOnlineTrueAndSkillNamesContaining(skillName);
        } else {
            sessions = sessionRepo.findByOnlineTrueAndRole("ROLE_STAFF");
        }

        return sessions.stream()
                .filter(s -> s.getLatitude() != null && s.getLongitude() != null)
                .filter(s -> s.getRole() != null && s.getRole().contains("STAFF"))
                .map(s -> {
                    double dist = haversineKm(lat, lng, s.getLatitude(), s.getLongitude());
                    return toDto(s, dist, lat);
                })
                .filter(dto -> radiusKm == null || dto.getDistanceKm() <= radiusKm)
                .sorted((a, b) -> Double.compare(a.getDistanceKm(), b.getDistanceKm()))
                .collect(Collectors.toList());
    }

    // ── Stale session cleanup — runs every 2 minutes ─────────────────────────
    @Scheduled(fixedDelay = 120_000)
    public void cleanStaleSessions() {
        // Mark as offline if no heartbeat for 3 minutes
        Instant cutoff = Instant.now().minusSeconds(180);
        sessionRepo.findByOnlineTrueAndLastSeenBefore(cutoff).forEach(s -> {
            s.setOnline(false);
            sessionRepo.save(s);
        });
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    private List<String> resolveSkillNames(List<SkillLevel> skillLevels) {
        if (skillLevels == null) return List.of();
        return skillLevels.stream()
                .map(sl -> {
                    Skill skill = skillRepo.findSkillBySkillId(sl.getSkillId());
                    return skill != null ? skill.getName() : null;
                })
                .filter(name -> name != null)
                .collect(Collectors.toList());
    }

    private OnlineUserDto toDto(UserSession s, Double distKm, Double originLat) {
        OnlineUserDto dto = new OnlineUserDto();
        dto.setUsername(s.getUsername());
        dto.setRole(s.getRole());
        dto.setLatitude(s.getLatitude());
        dto.setLongitude(s.getLongitude());
        dto.setOnline(s.isOnline());
        dto.setLastSeen(s.getLastSeen());
        dto.setSkillNames(s.getSkillNames());
        dto.setDistanceKm(distKm != null ? Math.round(distKm * 10.0) / 10.0 : null);
        return dto;
    }

    // Haversine formula — returns distance in km
    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
