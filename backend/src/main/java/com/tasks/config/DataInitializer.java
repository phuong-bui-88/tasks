package com.tasks.config;

import com.tasks.model.Role;
import com.tasks.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Autowired
    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        initRoles();
    }

    private void initRoles() {
        // Define default roles
        List<String> defaultRoles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        
        for (String roleName : defaultRoles) {
            if (!roleRepository.existsByName(roleName)) {
                Role role = new Role(roleName);
                roleRepository.save(role);
                System.out.println("Created default role: " + roleName);
            }
        }
    }
}
