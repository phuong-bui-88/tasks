package com.tasks.service;

import java.util.List;
import java.util.Optional;

import com.tasks.dto.RoleDTO;
import com.tasks.model.Role;

public interface RoleService {
    List<RoleDTO> getAllRoles();
    RoleDTO getRoleById(Long id);
    RoleDTO createRole(RoleDTO roleDto);
    RoleDTO updateRole(Long id, RoleDTO roleDto);
    void deleteRole(Long id);
    Role findOrCreateRole(String name);
    Optional<Role> findRoleByName(String name);
}
