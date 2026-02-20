package com.example.Servify.service;

import java.io.IOException;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;

@Service
public class ImageService {
    
    private final UserRepo userRepo;

    @Autowired
    private GridFsTemplate gridfs;

    public ImageService(UserRepo userRepo){
        this.userRepo = userRepo;
    }

    public String addCertificate(MultipartFile file) throws IOException{
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepo.findByUsername(username);
        user.setCertificateUrl(username);
        ObjectId store = gridfs.store(file.getInputStream(),file.getOriginalFilename(),file.getContentType());
        user.setCertificateUrl("http://localhost:8080/image/" + store);
        userRepo.save(user);
        return "successfully added";
    }



}
