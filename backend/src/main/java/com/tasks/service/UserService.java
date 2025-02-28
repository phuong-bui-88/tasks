package com.tasks.service;

import com.tasks.dto.UserDTO;
import com.tasks.dto.UserCreateDTO;
import com.tasks.dto.UserUpdateDTO;
import com.tasks.dto.RegistrationRequest;
import com.tasks.dto.AuthResponse;

import java.util.List;


public interface UserService {
    AuthResponse registerUser(RegistrationRequest registrationRequest);
    UserDTO findByUsername(String username);
    UserDTO findByEmail(String email);
    boolean existsByUsername(String username);
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO createUser(UserCreateDTO userCreateDto);
    UserDTO updateUser(Long id, UserUpdateDTO userUpdateDto);
    void deleteUser(Long id);
    UserDTO getUserByUsername(String username);
    UserDTO getUserByEmail(String email);
    boolean existsByEmail(String email);
}
