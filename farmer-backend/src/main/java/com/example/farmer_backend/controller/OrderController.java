package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.OrderItemResponse;
import com.example.farmer_backend.dto.OrderRequest;
import com.example.farmer_backend.dto.OrderResponse;
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

    // ================= USER PLACE ORDER =================
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

        return ResponseEntity.ok("Order placed successfully");
    }

    // ================= USER GET MY ORDERS =================
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ⭐ ONLY THIS USER'S ORDERS
        List<Order> orders = orderRepository.findByUserIdWithItems(user.getId());

        int counter = 1;

        List<OrderResponse> response = new ArrayList<>();

        for (Order order : orders) {

            OrderResponse dto = new OrderResponse();
            dto.displayOrderNo = counter++;   // ⭐ resets per user
            dto.id = order.getId();
            dto.status = order.getStatus();
            dto.totalAmount = order.getTotalAmount();

            dto.items = order.getItems().stream().map(item -> {
                OrderItemResponse i = new OrderItemResponse();
                i.id = item.getId();
                i.productName = item.getProduct().getName();
                i.quantity = item.getQuantity();
                i.price = item.getPrice();
                i.status = item.getStatus();
                return i;
            }).toList();

            response.add(dto);
        }

        return ResponseEntity.ok(response);
    }


    // ================= FARMER ORDERS =================
    @GetMapping("/farmer")
    @PreAuthorize("hasAuthority('FARMER')")
    public ResponseEntity<?> getFarmerOrders(Authentication auth) {

        User farmer = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return ResponseEntity.ok(orderItemRepository.findByFarmerId(farmer.getId()));
    }

    // ================= ADMIN ALL ORDERS =================
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllOrders() {

        List<Order> orders = orderRepository.findAllWithItems();

        List<OrderResponse> response = new ArrayList<>();

        int counter = 1;

        for (Order order : orders) {

            OrderResponse dto = new OrderResponse();
            dto.displayOrderNo = counter++;   // ⭐ global order numbering for admin
            dto.id = order.getId();
            dto.status = order.getStatus();
            dto.totalAmount = order.getTotalAmount();

            dto.userName = order.getUser().getName();
            dto.userEmail = order.getUser().getEmail();


            dto.items = order.getItems().stream().map(item -> {
                OrderItemResponse i = new OrderItemResponse();
                i.id = item.getId();
                i.productName = item.getProduct().getName();
                i.quantity = item.getQuantity();
                i.price = item.getPrice();
                i.status = item.getStatus();
                return i;
            }).toList();

            response.add(dto);
        }

        return ResponseEntity.ok(response);
    }

    // ================= ADMIN UPDATE STATUS =================
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long orderId,
                                          @RequestParam String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status.toUpperCase());
        orderRepository.save(order);

        return ResponseEntity.ok("Order status updated");
    }
}
