package com.example.farmer_backend.dto;

public class CategoryDTO {
    private Long id;
    private String name;

    // Constructor
    public CategoryDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Default constructor
    public CategoryDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
