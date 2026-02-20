package com.example.Servify.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.Servify.model.Users;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends MongoRepository<Users, String> {

    public Users findByUsername(String username);

    public boolean existsByUsername(String username);

    List<Users> findBySkillsSkillId(String skillId);

    void deleteByUsername(String username);
}
