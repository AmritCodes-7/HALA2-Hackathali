package com.example.Servify.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.Servify.model.ProblemPost;

@Repository
public interface ProblemPostRepo extends MongoRepository<ProblemPost, String>{
    
    public void deleteById(String postId);

    List<ProblemPost> findBySkillId(String skillId);
     
}
