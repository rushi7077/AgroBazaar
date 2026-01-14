package com.example.farmer_backend.service;

import com.example.farmer_backend.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);

    List<Product> getProductsByCategory(Long categoryId);
    List<Product> getProductsByFarmer(Long farmerId);
    List<Product> getProductsByPriceRange(Double min, Double max);
}
