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
        order.setStatus("PENDING");   // ⭐ important

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

        return ResponseEntity.ok(order.getId()); // ⭐ return orderId
    }
    @PutMapping("/{orderId}/pay")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> payOrder(@PathVariable Long orderId,
                                      Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ⭐ SECURITY CHECK → user can pay only own order
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not your order");
        }

        order.setStatus("PAID");
        orderRepository.save(order);

        return ResponseEntity.ok("Payment successful");
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

        System.out.println("JWT EMAIL = " + email);
        System.out.println("USER ID = " + user.getId());

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
    @PutMapping("/item/{itemId}/decision")
    @PreAuthorize("hasAnyAuthority('ADMIN','FARMER')")
    public ResponseEntity<?> decideItem(@PathVariable Long itemId,
                                        @RequestParam String decision,
                                        Authentication auth) {

        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        User seller = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✔ farmer security
        if (seller.getRole().getName().equals("FARMER")
                && !item.getFarmer().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).body("Not your product order");
        }

        // ⭐ IMPORTANT → order must be PAID first
        if (!item.getOrder().getStatus().equals("PAID")) {
            return ResponseEntity.badRequest().body("Order not paid yet");
        }

        if (!decision.equalsIgnoreCase("ACCEPTED")
                && !decision.equalsIgnoreCase("REJECTED")) {
            return ResponseEntity.badRequest().body("Invalid decision");
        }

        item.setStatus(decision.toUpperCase());
        orderItemRepository.save(item);

        // ⭐ update overall order status
        updateOrderStatus(item.getOrder());

        return ResponseEntity.ok("Item " + decision);
    }

    private void updateOrderStatus(Order order) {

        boolean anyRejected = order.getItems().stream()
                .anyMatch(i -> i.getStatus().equals("REJECTED"));

        boolean allAccepted = order.getItems().stream()
                .allMatch(i -> i.getStatus().equals("ACCEPTED"));

        boolean allCompleted = order.getItems().stream()
                .allMatch(i -> i.getStatus().equals("COMPLETED"));

        if (allCompleted) {
            order.setStatus("COMPLETED");
        } else if (anyRejected) {
            order.setStatus("PARTIAL");
        } else if (allAccepted) {
            order.setStatus("ACCEPTED");
        }

        orderRepository.save(order);
    }


    @PutMapping("/item/{itemId}/complete")
    @PreAuthorize("hasAnyAuthority('ADMIN','FARMER')")
    public ResponseEntity<?> completeItem(@PathVariable Long itemId,
                                          Authentication auth) {

        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        User seller = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (seller.getRole().getName().equals("FARMER")
                && !item.getFarmer().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).body("Not your product order");
        }

        if (!item.getStatus().equals("ACCEPTED")) {
            return ResponseEntity.badRequest().body("Item must be ACCEPTED first");
        }

        item.setStatus("COMPLETED");
        orderItemRepository.save(item);

        // ⭐ sync overall order
        updateOrderStatus(item.getOrder());

        return ResponseEntity.ok("Item completed");
    }

}
