package es.brasatech.chat.domain;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
public class User {
    private String id;
    private String name;
    private Status status;
    private Set<String> openSessions = new HashSet<>();

    public User(String name, String openSession) {
        this(name);
        this.openSessions.add(openSession);
    }
    public User(String name) {
        this();
        this.name = name;
    }

    public User() {
        this.id = UUID.randomUUID().toString();
        this.openSessions = new HashSet<>();
    }
}
