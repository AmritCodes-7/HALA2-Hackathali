package com.example.Servify.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.model.ProblemPost;
import com.example.Servify.service.ProblemPostService;




@RestController
@RequestMapping("/api/v1/post")
public class ProblemPostController {

    @Autowired ProblemPostService problemPostService;

    @PostMapping("/save")
    public ResponseEntity<BackendResponse> addAPoString(@RequestBody ProblemPost post ) {
            String message = problemPostService.postThePost(post);

            return ResponseEntity 
            .ok()
            .body(new BackendResponse(true, message));
            
    }

    @GetMapping
    public ResponseEntity<BackendResponse> getAllPosts() {
        List<ProblemPost> allPost = problemPostService.getAllPost();

        return ResponseEntity
        .ok()
        .body(new BackendResponse(true,allPost));
    }

    @DeleteMapping
    public ResponseEntity<BackendResponse> deletePost(@RequestBody ProblemPost problemPost){
        String problemPostSolved = problemPostService.problemPostSolved(problemPost);

        return ResponseEntity
        .ok()
        .body(new BackendResponse(true, problemPostSolved));
    }

    @GetMapping("{skillId}")
    public ResponseEntity<BackendResponse> findPostBySkill(@PathVariable String skillId) {
        List<ProblemPost> bySkillId = problemPostService.findBySkillId(skillId);

        return ResponseEntity
        .ok()
        .body(new BackendResponse(true,bySkillId));
    }
    
    


    
    
}
