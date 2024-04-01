package es.brasatech.chat.repository;

import es.brasatech.chat.repository.entity.ChatMessageEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends CrudRepository<ChatMessageEntity, Long> {

}