package es.brasatech.chat.controller;

import es.brasatech.chat.domain.User;
import es.brasatech.chat.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserAPIController {
    private final UserService userService;

    @GetMapping
    public Set<String> allUsers() {
        return userService.getAllUsers().stream()
            .map(User::getName)
            .collect(Collectors.toSet());
    }
}
