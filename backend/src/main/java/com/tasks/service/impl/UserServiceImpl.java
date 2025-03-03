package com.tasks.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tasks.dto.AuthResponse;
import com.tasks.dto.RegistrationRequest;
import com.tasks.dto.UserCreateDTO;
import com.tasks.dto.UserDTO;
import com.tasks.dto.UserUpdateDTO;
import com.tasks.exception.ResourceAlreadyExistsException;
import com.tasks.exception.ResourceNotFoundException;
import com.tasks.model.Role;
import com.tasks.model.User;
import com.tasks.repository.RoleRepository;
import com.tasks.repository.UserRepository;
import com.tasks.service.JwtService;
import com.tasks.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse registerUser(RegistrationRequest registrationRequest) {
        // Check if username exists
        if (userRepository.existsByUsername(registrationRequest.getUsername())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Username is already taken")
                    .build();
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(registrationRequest.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email is already in use")
                    .build();
        }
        
        // Create new user
        User user = new User();
        user.setUsername(registrationRequest.getUsername());
        user.setEmail(registrationRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        
        // Set default role - USER
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
            user.setRole(userRole);
        }
        
        // Set created timestamp and active status
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        
        // Save user to database
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(savedUser.getUsername());
        
        // Convert role string to a set for AuthResponse
        Set<String> roles = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        
        // Return AuthResponse
        return AuthResponse.builder()
                .success(true)
                .message("User registered successfully")
                .token(token)
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .roles(roles)
                .build();
    }

    @Override
    public UserDTO findByUsername(String username) {
        // Implementation for finding a user by username
        return null;
    }

    @Override
    public UserDTO findByEmail(String email) {
        // Implementation for finding a user by email
        return null;
    }

    @Override
    public boolean existsByUsername(String username) {
        // Implementation for checking if a username exists
        return false;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }

    @Override
    public UserDTO createUser(UserCreateDTO userCreateDto) {
        // Check if username exists
        if (userRepository.existsByUsername(userCreateDto.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists: " + userCreateDto.getUsername());
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(userCreateDto.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists: " + userCreateDto.getEmail());
        }
        
        User user = new User();
        user.setUsername(userCreateDto.getUsername());
        user.setEmail(userCreateDto.getEmail());
        user.setPassword(passwordEncoder.encode(userCreateDto.getPassword()));
        
        // Set role if provided, otherwise ensure default is set
        if (userCreateDto.getRole() != null && !userCreateDto.getRole().isEmpty()) {
            Role userRole = roleRepository.findByName(userCreateDto.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
            user.setRole(userRole);
        } else {
            Role defaultRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));
            user.setRole(defaultRole);
        }
        
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public UserDTO updateUser(Long id, UserUpdateDTO userUpdateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Update username if provided and not already taken
        if (userUpdateDto.getUsername() != null) {
            userRepository.findByUsername(userUpdateDto.getUsername())
                    .ifPresent(existingUser -> {
                        if (!existingUser.getId().equals(id)) {
                            throw new ResourceAlreadyExistsException("Username already exists: " + userUpdateDto.getUsername());
                        }
                    });
            user.setUsername(userUpdateDto.getUsername());
        }
        
        // Update email if provided and not already taken
        if (userUpdateDto.getEmail() != null) {
            userRepository.findByEmail(userUpdateDto.getEmail())
                    .ifPresent(existingUser -> {
                        if (!existingUser.getId().equals(id)) {
                            throw new ResourceAlreadyExistsException("Email already exists: " + userUpdateDto.getEmail());
                        }
                    });
            user.setEmail(userUpdateDto.getEmail());
        }
        
        // Update password if provided
        if (userUpdateDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));
        }
        
        if (userUpdateDto.getRole() != null) {
            Role userRole = roleRepository.findByName(userUpdateDto.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + userUpdateDto.getRole()));
            user.setRole(userRole);
        }
        
        if (userUpdateDto.getActive() != null) {
            user.setActive(userUpdateDto.getActive());
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return convertToDto(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToDto(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    private UserDTO convertToDto(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        Set<String> roleNames = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toSet());
        userDTO.setRoles(roleNames);
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setActive(user.isActive());
        return userDTO;
    }
}
