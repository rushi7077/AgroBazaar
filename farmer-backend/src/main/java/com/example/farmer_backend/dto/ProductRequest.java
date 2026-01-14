package com.example.farmer_backend.dto;

import lombok.Data;

@Data
public class ProductRequest {

    private String name;
    private Double price;
    private Integer quantity;
    private String categoryName; // selected from dropdown
}
