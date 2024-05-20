package es.brasatech.chat.listener;


import lombok.AllArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Component
@AllArgsConstructor
public class UserConnectEventListener {

    private final SimpMessageSendingOperations simpMessageSendingOperations;

    @EventListener
    public void handle(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = (String) headerAccessor.getSessionId();
        System.out.println(sessionId + " has joined");

    }
}
