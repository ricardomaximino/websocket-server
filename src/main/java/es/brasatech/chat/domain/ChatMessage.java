package es.brasatech.chat.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private String receiver;
    private LocalDateTime dateTime;

    public ChatMessage() {
        this.dateTime = LocalDateTime.now();
    }
}