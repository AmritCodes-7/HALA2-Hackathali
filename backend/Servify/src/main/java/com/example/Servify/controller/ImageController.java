package com.example.Servify.controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Servify.dto.BackendResponse;
import com.example.Servify.service.ImageService;
import com.mongodb.client.gridfs.model.GridFSFile;

import io.jsonwebtoken.io.IOException;

@RestController
@RequestMapping("/api")
public class ImageController {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private ImageService imageService;

    @PostMapping("/add/certificate")
    public ResponseEntity<?> postThePost(@RequestPart("file") MultipartFile file) {
        try{
            String message = imageService.addCertificate(file);
            return ResponseEntity.ok().body(new BackendResponse(true, message));
        }catch(IOException e){
            return ResponseEntity.badRequest().body(new BackendResponse(false, e.getMessage()));
        }
        catch(java.io.IOException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BackendResponse(false,"something went wrong"));
        }     
    }
    
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

}
