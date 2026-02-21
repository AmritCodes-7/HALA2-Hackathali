package com.example.Servify.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.model.Users;
import com.example.Servify.repository.UserRepo;
import com.mongodb.client.gridfs.model.GridFSFile;

import io.jsonwebtoken.io.IOException;


@RestController
@RequestMapping("/api/v1")
public class ImageController {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired UserRepo userRepo;


    @GetMapping("/image/{imageId}")
        public ResponseEntity<?> getImage(@PathVariable String imageId) throws IOException, java.io.IOException {
        
        ObjectId fileId = new ObjectId(imageId);

        GridFSFile file = gridFsTemplate.findOne(Query.query(Criteria.where("_id").is(fileId)));
        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        GridFsResource resource = gridFsTemplate.getResource(file);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getMetadata().get("_contentType").toString()))
                .body(resource.getInputStream().readAllBytes());
    }

    @PostMapping("/change-certificate")
    public ResponseEntity<BackendResponse> changeCertificate(@RequestPart("file") MultipartFile certificate) throws java.io.IOException {
        
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepo.findByUsername(name);
        ObjectId store = gridFsTemplate.store(certificate.getInputStream(),certificate.getOriginalFilename(),certificate.getContentType());
        user.setCertificateUrl("http://localhost:8080/api/v1/image/" + store);
        userRepo.save(user);
        return ResponseEntity.ok().body(new BackendResponse(true,"changed"));
    }
    

}
