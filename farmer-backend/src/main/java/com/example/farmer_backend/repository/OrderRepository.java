package com.example.farmer_backend.repository;

import com.example.farmer_backend.model.Order;
import com.example.farmer_backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
SELECT o FROM Order o
LEFT JOIN FETCH o.items
WHERE o.user.id = :userId
ORDER BY o.id ASC
""")
    List<Order> findByUserIdWithItems(Long userId);



    @Query("""
SELECT DISTINCT o FROM Order o
LEFT JOIN FETCH o.items
LEFT JOIN FETCH o.user
ORDER BY o.id ASC
""")
    List<Order> findAllWithItems();

    @Query("""
SELECT oi FROM OrderItem oi
JOIN FETCH oi.order
JOIN FETCH oi.product
WHERE oi.farmer.id = :sellerId
""")
    List<OrderItem> findSellerItems(Long sellerId);




}

