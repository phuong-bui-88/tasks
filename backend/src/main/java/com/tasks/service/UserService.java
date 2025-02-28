package com.tasks.service;

import com.tasks.dto.UserCreateDto;
import com.tasks.dto.UserDto;
import com.tasks.dto.UserUpdateDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto createUser(UserCreateDto userCreateDto);
    UserDto updateUser(Long id, UserUpdateDto userUpdateDto);
    void deleteUser(Long id);
    UserDto getUserByUsername(String username);
    UserDto getUserByEmail(String email);
}
