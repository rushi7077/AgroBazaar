package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.OrderRequest;
import com.example.farmer_backend.model.*;
import com.example.farmer_backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // ✅ USER PLACES ORDER
    @PostMapping
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("CREATED");

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (var itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setFarmer(product.getFarmer());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());
            item.setOrder(order);
            item.setStatus("PENDING");


            total += product.getPrice() * itemReq.getQuantity();
            items.add(item);
        }

        order.setTotalAmount(total);
        order.setItems(items);
        orderRepository.save(order);

        return ResponseEntity.ok(order);
    }

    // ✅ USER GET THEIR ORDERS
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> getMyOrders(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow();
        return ResponseEntity.ok(orderRepository.findByUserId(user.getId()));
    }

    // ✅ FARMER GET ORDERS FOR THEIR PRODUCTS
    @GetMapping("/farmer")
    @PreAuthorize("hasAuthority('FARMER')")
    public ResponseEntity<?> getFarmerOrders(Authentication auth) {
        User farmer = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(orderItemRepository.findByFarmerId(farmer.getId()));
    }

    // ✅ ADMIN GET ALL ORDERS
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    // ✅ ADMIN / USER UPDATE STATUS (example)
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId, @RequestParam String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status.toUpperCase());
        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }
}
