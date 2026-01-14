package com.example.farmer_backend.controller;

import com.example.farmer_backend.model.*;
import com.example.farmer_backend.repository.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer")
@PreAuthorize("hasRole('FARMER')")
public class FarmerController {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    public FarmerController(ProductRepository productRepository,
                            OrderItemRepository orderItemRepository,
                            UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
    }

    /* ================= FARMER PROFILE ================= */

    @GetMapping("/me")
    public User getMyProfile(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

    /* ================= FARMER PRODUCTS ================= */

    @GetMapping("/products")
    public List<Product> getMyProducts(Authentication authentication) {
        User farmer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return productRepository.findByFarmerId(farmer.getId());
    }

    /* ================= FARMER ORDERS ================= */

    @GetMapping("/orders")
    public List<OrderItem> getOrdersForMyProducts(Authentication authentication) {
        User farmer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return orderItemRepository.findByFarmerId(farmer.getId());
    }
    @PutMapping("/order-items/{id}/status")
    public OrderItem updateOrderItemStatus(@PathVariable Long id,
                                           @RequestParam String status,
                                           Authentication authentication) {

        User farmer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        if (!item.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("You can update only your orders");
        }

        item.setStatus(status.toUpperCase());
        return orderItemRepository.save(item);
    }

}
