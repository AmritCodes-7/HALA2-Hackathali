package com.example.Servify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.Servify.model.ChatMessage;


@Controller
public class MessageController {

    @Autowired SimpMessagingTemplate messageTemplate;
    
    @MessageMapping("/chat")
    @SendTo("/public/all")
    public ChatMessage broadChatMessage(ChatMessage message){
        return message;
    }

    @MessageMapping("/private")
    public void sendPrivateMessage(ChatMessage message){
        messageTemplate.convertAndSendToUser(message.getReceiver(), "/queue/specific", message);
    }

}
