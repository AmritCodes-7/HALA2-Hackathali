package com.example.Servify.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Servify.model.ProblemPost;
import com.example.Servify.repository.ProblemPostRepo;

@Service
public class ProblemPostService {
    
    @Autowired ProblemPostRepo problemPostRepo;

    public String postThePost(ProblemPost post){
        problemPostRepo.save(post);
        return "successfully saved";
    }
   
    public List<ProblemPost> getAllPost(){
        return problemPostRepo.findAll();
    }

    public String problemPostSolved(ProblemPost post){
        problemPostRepo.deleteById(post.getId());
        return "post deleted";
    }

    public List<ProblemPost> findBySkillId(String skillId){
        return problemPostRepo.findBySkillId(skillId);
    }


}
