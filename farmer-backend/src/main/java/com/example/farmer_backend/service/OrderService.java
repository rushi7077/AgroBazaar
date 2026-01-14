package com.example.farmer_backend.service;

import com.example.farmer_backend.model.Order;

import java.util.List;

public interface OrderService {

    List<Order> getAllOrders();
    Order getOrderById(Long id);
    Order updateOrderStatus(Long orderId, String status);
}
