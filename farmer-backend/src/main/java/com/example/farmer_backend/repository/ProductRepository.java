package com.example.farmer_backend.repository;

import com.example.farmer_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategory_NameIgnoreCase(String categoryName);

    List<Product> findByPriceBetween(Double min, Double max);

    List<Product> findByFarmerId(Long farmerId);

    List<Product> findByNameContainingIgnoreCaseAndCategory_NameIgnoreCase(
            String name, String categoryName
    );

    List<Product> findByCategory_NameIgnoreCaseAndPriceBetween(
            String categoryName, Double min, Double max
    );
}
