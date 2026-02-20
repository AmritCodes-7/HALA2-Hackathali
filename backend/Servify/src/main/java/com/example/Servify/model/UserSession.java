package com.example.Servify.model;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "UserSessions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSession {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String role;

    private Double latitude;

    private Double longitude;

    private boolean online;

    private Instant lastSeen;

    // Skills carried over from Users so we can filter without joining
    private List<String> skillNames;
}
