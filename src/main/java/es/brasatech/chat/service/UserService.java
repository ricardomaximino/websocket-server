package es.brasatech.chat.service;

import es.brasatech.chat.domain.User;

import java.util.List;
import java.util.Set;

public interface UserService {

    Set<String> getUserSessions(String username);
    void removeSession(String session);
    void addSession(String session, String username);
    String addUser(User user);
    void remove(User user);
    int countOnlineUsers();
    List<User> getAllUsers();
}
