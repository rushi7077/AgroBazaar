package com.example.farmer_backend.config;

import com.example.farmer_backend.model.Category;
import com.example.farmer_backend.model.Role;
import com.example.farmer_backend.model.User;
import com.example.farmer_backend.repository.RoleRepository;
import com.example.farmer_backend.repository.UserRepository;
import com.example.farmer_backend.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // 1️⃣ Create roles if not exist
            Role adminRole = roleRepository.findByNameIgnoreCase("ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ADMIN");
                        return roleRepository.save(role);
                    });

            Role userRole = roleRepository.findByNameIgnoreCase("USER")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("USER");
                        return roleRepository.save(role);
                    });

            Role farmerRole = roleRepository.findByNameIgnoreCase("FARMER")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("FARMER");
                        return roleRepository.save(role);
                    });

            // 2️⃣ Create default admin if not exist
            if (userRepository.findByEmail("admin@agrobazaar.com").isEmpty()) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail("admin@agrobazaar.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(adminRole);

                userRepository.save(admin);

                System.out.println("✅ Default ADMIN created");
                System.out.println("📧 admin@agrobazaar.com");
                System.out.println("🔑 admin123");
            }

            // 🌱 DEFAULT CATEGORIES


            for (String name : categories) {
                categoryRepository.findByName(name)
                        .orElseGet(() -> {
                            Category c = new Category();
                            c.setName(name);
                            return categoryRepository.save(c);
                        });
            }
        };
    }
}
