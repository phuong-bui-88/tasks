package com.tasks.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Set<String> roles = new HashSet<>();
    private LocalDateTime createdAt;
    private boolean active;
}
