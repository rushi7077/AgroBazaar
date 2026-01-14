package com.example.farmer_backend.repository;

import com.example.farmer_backend.model.Order;
import com.example.farmer_backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}

