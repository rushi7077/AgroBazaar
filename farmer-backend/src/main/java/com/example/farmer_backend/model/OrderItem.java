package com.example.farmer_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor

public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Order order;

    @ManyToOne
    private Product product;

    @ManyToOne
    private User farmer;

    private int quantity;

    private double price;

    // ✅ NEW
    private String status; // PENDING, ACCEPTED, SHIPPED, DELIVERED
}

