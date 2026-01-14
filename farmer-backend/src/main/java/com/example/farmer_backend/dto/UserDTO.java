package com.example.farmer_backend.dto;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private RoleDTO role;

    public UserDTO() {}

    public UserDTO(Long id, String name, String email, RoleDTO role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public RoleDTO getRole() { return role; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(RoleDTO role) { this.role = role; }
}
