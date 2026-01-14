package com.example.farmer_backend.dto;

public class ProductDTO {
    private Long id;
    private String name;
    private double price;
    private int quantity;
    private CategoryDTO category;
    private UserDTO farmer;

    // Constructor
    public ProductDTO(Long id, String name, double price, int quantity, CategoryDTO category, UserDTO farmer) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.farmer = farmer;
    }

    // Default constructor
    public ProductDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }

    public UserDTO getFarmer() { return farmer; }
    public void setFarmer(UserDTO farmer) { this.farmer = farmer; }
}
