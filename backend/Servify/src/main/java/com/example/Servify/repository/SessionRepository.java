package com.example.Servify.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.Servify.model.UserSession;

@Repository
public interface SessionRepository extends MongoRepository<UserSession, String> {

    Optional<UserSession> findByUsername(String username);

    // All currently online sessions
    List<UserSession> findByOnlineTrue();

    // Online sessions by role
    List<UserSession> findByOnlineTrueAndRole(String role);

    // Online sessions that have a skill
    List<UserSession> findByOnlineTrueAndSkillNamesContaining(String skillName);

    // Sessions that went stale (for cleanup)
    List<UserSession> findByOnlineTrueAndLastSeenBefore(Instant cutoff);

    void deleteByUsername(String username);
}
