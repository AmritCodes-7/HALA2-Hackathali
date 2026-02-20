package com.example.Servify.repository;

import com.example.Servify.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepo extends MongoRepository<Skill, Integer> {

}
