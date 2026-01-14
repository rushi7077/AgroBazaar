package com.example.farmer_backend.service.impl;

import com.example.farmer_backend.model.Product;
import com.example.farmer_backend.model.Category;
import com.example.farmer_backend.model.User;
import com.example.farmer_backend.repository.ProductRepository;
import com.example.farmer_backend.repository.CategoryRepository;
import com.example.farmer_backend.repository.UserRepository;
import com.example.farmer_backend.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    @Override
    public Product createProduct(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id " + product.getCategory().getId()));
            product.setCategory(category);
        }
        if (product.getFarmer() != null && product.getFarmer().getId() != null) {
            User farmer = userRepository.findById(product.getFarmer().getId())
                    .orElseThrow(() -> new RuntimeException("Farmer not found with id " + product.getFarmer().getId()));
            product.setFarmer(farmer);
        }
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setQuantity(productDetails.getQuantity());

        if (productDetails.getCategory() != null && productDetails.getCategory().getId() != null) {
            Category category = categoryRepository.findById(productDetails.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id " + productDetails.getCategory().getId()));
            product.setCategory(category);
        }

        if (productDetails.getFarmer() != null && productDetails.getFarmer().getId() != null) {
            User farmer = userRepository.findById(productDetails.getFarmer().getId())
                    .orElseThrow(() -> new RuntimeException("Farmer not found with id " + productDetails.getFarmer().getId()));
            product.setFarmer(farmer);
        }

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));
        productRepository.delete(product);
    }


    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> getProductsByFarmer(Long farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }

    @Override
    public List<Product> getProductsByPriceRange(Double min, Double max) {
        return productRepository.findByPriceBetween(min, max);
    }
}
