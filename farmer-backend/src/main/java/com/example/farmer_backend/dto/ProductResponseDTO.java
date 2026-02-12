package com.example.farmer_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private double price;
    private int quantity;
    private String category;
    private FarmerDTO farmer;
    public Long farmerId;
}

