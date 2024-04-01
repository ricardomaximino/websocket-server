package es.brasatech.chat.shared;

import es.brasatech.chat.domain.ChatMessage;
import es.brasatech.chat.domain.MessageType;
import es.brasatech.chat.repository.entity.ChatMessageEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChatMessageMapper {

    ChatMessage mapToChatMessage(ChatMessageEntity chatMessageEntity);

    ChatMessageEntity mapToChatMessageEntity(ChatMessage chatMessage);

    default MessageType mapToMessageType(String messageType) {
        return MessageType.valueOf(messageType);
    }
}
