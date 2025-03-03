package com.tasks.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tasks.dto.RoleDTO;
import com.tasks.exception.ResourceAlreadyExistsException;
import com.tasks.exception.ResourceNotFoundException;
import com.tasks.model.Role;
import com.tasks.repository.RoleRepository;
import com.tasks.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        return convertToDto(role);
    }

    @Override
    public RoleDTO createRole(RoleDTO roleDto) {
        if (roleRepository.existsByName(roleDto.getName())) {
            throw new ResourceAlreadyExistsException("Role already exists with name: " + roleDto.getName());
        }
        Role role = new Role();
        role.setName(roleDto.getName());
        
        Role savedRole = roleRepository.save(role);
        return convertToDto(savedRole);
    }

    @Override
    public RoleDTO updateRole(Long id, RoleDTO roleDto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
        
        if (!role.getName().equals(roleDto.getName()) && roleRepository.existsByName(roleDto.getName())) {
            throw new ResourceAlreadyExistsException("Role already exists with name: " + roleDto.getName());
        }
        
        role.setName(roleDto.getName());
        
        Role updatedRole = roleRepository.save(role);
        return convertToDto(updatedRole);
    }

    @Override
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role not found with id: " + id);
        }
        roleRepository.deleteById(id);
    }
    
    @Override
    public Role findOrCreateRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> {
                    Role newRole = new Role(name);
                    return roleRepository.save(newRole);
                });
    }
    
    @Override
    public Optional<Role> findRoleByName(String name) {
        return roleRepository.findByName(name);
    }
    
    private RoleDTO convertToDto(Role role) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setId(role.getId());
        roleDTO.setName(role.getName());
        return roleDTO;
    }
}
