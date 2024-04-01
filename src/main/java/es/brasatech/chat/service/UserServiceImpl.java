package es.brasatech.chat.service;

import es.brasatech.chat.domain.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@Log4j2
public class UserServiceImpl implements UserService {
    private Map<String, User> sessionMap = new HashMap<>();

    @Override
    public Set<String> getUserSessions(String username) {
        User user = sessionMap.get(username);
        if(user != null ) {
            return user.getOpenSessions();
        }
        return new HashSet<>();
    }

    @Override
    public void removeSession(String session) {
        for(Map.Entry<String, User> entry : sessionMap.entrySet()){
            User user = entry.getValue();
            if(user.getOpenSessions().contains(session)) {
                user.getOpenSessions().remove(session);
                log.info("Session {}, has been removed from user {}", session, user.getId());
            }
        }

    }

    @Override
    public void addSession(String session, String username) {
        User user = sessionMap.get(username);
        if(user != null) {
            user.getOpenSessions().add(session);
        }else {
            log.info("The username {}, is not registered", username);
        }
    }

    @Override
    public String addUser(User user) {
        if(sessionMap.containsKey(user.getName())){
            User existedUser = sessionMap.get(user.getName());
            user.getOpenSessions().stream().forEach(existedUser.getOpenSessions()::add);
            return existedUser.getId();
        } else{
            this.sessionMap.put(user.getName(), user);
            return user.getId();
        }
    }

    @Override
    public void remove(User user) {
        this.sessionMap.remove(user.getName());
    }

    @Override
    public int countOnlineUsers() {
        return sessionMap.size();
    }
}
