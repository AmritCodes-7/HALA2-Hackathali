package com.example.Servify.repository;

import java.util.List;

import com.example.Servify.model.SkillLevel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Servify.model.Users;

@Repository
public interface UserRepo extends MongoRepository<Users, String> {

    public Users findByUsername(String username);

    public boolean existsByUsername(String username);

    List<Users> findBySkillsSkillId(String skillId);

    void deleteByUsername(String username);

    @Query("{ 'skills.skillId': ?0 }")
    List<Users> findBySkillId(String skillId);
}
