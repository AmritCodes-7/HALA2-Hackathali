package com.example.Servify.repository;

import com.example.Servify.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepo extends MongoRepository<Skill, String> {

    Skill findSkillBySkillId(String skillId);
    Skill findByName(String skillname);

    boolean existsByName(String name);
}
