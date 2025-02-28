package com.tasks.service.impl;

import com.tasks.dto.UserCreateDto;
import com.tasks.dto.UserDto;
import com.tasks.dto.UserUpdateDto;
import com.tasks.exception.ResourceAlreadyExistsException;
import com.tasks.exception.ResourceNotFoundException;
import com.tasks.model.User;
import com.tasks.repository.UserRepository;
import com.tasks.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }

    @Override
    public UserDto createUser(UserCreateDto userCreateDto) {
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
        user.setFirstName(userCreateDto.getFirstName());
        user.setLastName(userCreateDto.getLastName());
        
        // Set role if provided, otherwise default is USER from entity definition
        if (userCreateDto.getRole() != null && !userCreateDto.getRole().isEmpty()) {
            user.setRole(userCreateDto.getRole());
        }
        
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    @Override
    public UserDto updateUser(Long id, UserUpdateDto userUpdateDto) {
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
        
        // Update other fields if provided
        if (userUpdateDto.getFirstName() != null) {
            user.setFirstName(userUpdateDto.getFirstName());
        }
        
        if (userUpdateDto.getLastName() != null) {
            user.setLastName(userUpdateDto.getLastName());
        }
        
        if (userUpdateDto.getRole() != null) {
            user.setRole(userUpdateDto.getRole());
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
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return convertToDto(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return convertToDto(user);
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setRole(user.getRole());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setActive(user.isActive());
        return userDto;
    }
}
