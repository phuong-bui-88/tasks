package com.tasks.service;

import com.tasks.dto.UserDTO;
import com.tasks.dto.UserCreateDTO;
import com.tasks.dto.UserUpdateDTO;
import com.tasks.dto.RegistrationRequest;
import com.tasks.dto.AuthResponse;
import com.tasks.dto.LoginRequest;

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


    /**
     * Authenticates a user with the provided credentials
     *
     * @param loginRequest the login credentials
     * @return AuthResponse containing authentication result and token if successful
     */
    AuthResponse loginUser(LoginRequest loginRequest);

    /**
     * Logs out the currently authenticated user
     *
     * @return AuthResponse indicating the result of the logout operation
     */
    AuthResponse logoutUser();
}
