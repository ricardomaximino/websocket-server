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
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.user.UserDestinationMessageHandler;
import org.springframework.stereotype.Controller;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class PublicChatController {
    public static final String PUBLIC_CHAT = "all";
    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final UserService userService;
    private final SimpMessageSendingOperations simpMessageSendingOperations;

    @GetMapping("/chat")
    public String chat() {
        return "chat";
    }

    @MessageMapping("/chat/public/sendMessage")
    @SendTo("/topic/chat")
    public ChatMessage publicChat(@Payload ChatMessage chatMessage) {
        chatMessage.setReceiver(PUBLIC_CHAT);
        var chatMessageEntity = chatMessageRepository.save(chatMessageMapper.mapToChatMessageEntity(chatMessage));
        return chatMessageMapper.mapToChatMessage(chatMessageEntity);
    }

    @MessageMapping("/chat/private/sendMessage")
    public void privateChat(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
        chatMessage.setContent("Private: " + chatMessage.getContent());
        var chatMessageEntity = chatMessageRepository.save(chatMessageMapper.mapToChatMessageEntity(chatMessage));
        var sessionList = userService.getUserSessions(chatMessage.getReceiver());
        sessionList.forEach(receiverSession -> {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create();
        accessor.setSessionId(receiverSession);
	    accessor.setLeaveMutable(false);
        simpMessageSendingOperations.convertAndSendToUser(
                receiverSession,
                "/queue/chat",
                chatMessageMapper.mapToChatMessage(chatMessageEntity),
                accessor.getMessageHeaders());
            }
        );
    }

    @MessageMapping("/chat/me/sendMessage")
    @SendToUser("/queue/chat")
    public ChatMessage meChat(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
        chatMessage.setContent(chatMessage.getContent() + " me");
        var chatMessageEntity = chatMessageRepository.save(chatMessageMapper.mapToChatMessageEntity(chatMessage));
        return chatMessage;
    }

    @MessageMapping("/chat/addUser")
    @SendTo("/topic/chat")
    ChatMessage addUser(@Payload ChatMessage chatMessage, @Header("simpSessionId") String sessionId,
                        SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
        userService.addUser(new User(chatMessage.getSender(), sessionId));
        String id = UUID.randomUUID().toString();
        simpMessageHeaderAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        simpMessageHeaderAccessor.getSessionAttributes().put("userId",id);
        return chatMessage;
    }
}