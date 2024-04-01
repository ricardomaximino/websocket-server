package es.brasatech.chat.controller;

import es.brasatech.chat.domain.ChatMessage;
import es.brasatech.chat.repository.ChatMessageRepository;
import es.brasatech.chat.shared.ChatMessageMapper;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/chat")
public class ChatMessageRestController {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageMapper chatMessageMapper;

    @GetMapping
    public List<ChatMessage> findAll() {
        List<ChatMessage> list = new ArrayList<>();
        chatMessageRepository.findAll().iterator().forEachRemaining(i -> list.add(chatMessageMapper.mapToChatMessage(i)));
        return list;
    }

}
