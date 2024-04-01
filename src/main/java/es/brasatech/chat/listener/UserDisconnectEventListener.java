package es.brasatech.chat.listener;

import es.brasatech.chat.domain.ChatMessage;
import es.brasatech.chat.domain.MessageType;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

@Component
@AllArgsConstructor
public class UserDisconnectEventListener {

    private final SimpMessageSendingOperations simpMessageSendingOperations;

    @EventListener
    public void handle(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null) {
            var chatMessage = new ChatMessage(MessageType.LEAVE, null, username, null, LocalDateTime.now());
            simpMessageSendingOperations.convertAndSend("/topic/chat", chatMessage);
        }

    }
}