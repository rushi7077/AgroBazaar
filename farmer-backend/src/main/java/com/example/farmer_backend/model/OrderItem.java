package com.example.farmer_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JoinColumn(name="order_id")
    @JsonBackReference
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

