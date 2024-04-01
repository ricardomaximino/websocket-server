package es.brasatech.chat.controller;

import es.brasatech.chat.domain.ChatMessage;
import es.brasatech.chat.domain.User;
import es.brasatech.chat.repository.ChatMessageRepository;
import es.brasatech.chat.service.UserService;
import es.brasatech.chat.shared.ChatMessageMapper;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class PublicChatController {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final UserService userService;
    private final SimpMessageSendingOperations simpMessageSendingOperations;

    @MessageMapping("/chat/public/sendMessage")
    @SendTo("/topic/chat")
    public ChatMessage publicChat(@Payload ChatMessage chatMessage) {
        var chatMessageEntity = chatMessageRepository.save(chatMessageMapper.mapToChatMessageEntity(chatMessage));
        return chatMessageMapper.mapToChatMessage(chatMessageEntity);
    }

    @MessageMapping("/chat/addUser")
    @SendTo("/topic/chat")
    ChatMessage addUser(@Payload ChatMessage chatMessage, @Header("simpSessionId") String sessionId,
                        SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
        userService.addUser(new User(chatMessage.getSender(), sessionId));
        simpMessageHeaderAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }
}