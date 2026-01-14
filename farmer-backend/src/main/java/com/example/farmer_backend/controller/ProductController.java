package com.example.farmer_backend.controller;

import com.example.farmer_backend.dto.FarmerDTO;
import com.example.farmer_backend.dto.ProductRequest;
import com.example.farmer_backend.dto.ProductResponseDTO;
import com.example.farmer_backend.model.*;
import com.example.farmer_backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository productRepository,
                             CategoryRepository categoryRepository,
                             UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // ✅ ADMIN + FARMER → ADD PRODUCT
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','FARMER')")
    public ResponseEntity<?> addProduct(
            @RequestBody ProductRequest request,
            Authentication authentication) {

        User farmer = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository
                .findByName(request.getCategoryName())
                .orElseThrow(() ->
                        new RuntimeException("Category not found: " + request.getCategoryName()));

        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);
        product.setFarmer(farmer);

        Product saved = productRepository.save(product);
        return ResponseEntity.ok(mapToDTO(saved));

    }


    // ✅ ADMIN + FARMER → UPDATE PRODUCT
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','FARMER')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request,
            Authentication authentication) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 FARMER CAN UPDATE ONLY OWN PRODUCT
        if (user.getRole().getName().equals("FARMER")
                && !product.getFarmer().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can update only your own products");
        }

        Category category = categoryRepository
                .findByName(request.getCategoryName())
                .orElseThrow(() ->
                        new RuntimeException("Category not found: " + request.getCategoryName()));

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);

        Product updated = productRepository.save(product);

        // ✅ RETURN DTO (IMPORTANT)
        return ResponseEntity.ok(mapToDTO(updated));
    }



    // ✅ ADMIN + FARMER → DELETE PRODUCT
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','FARMER')")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 FARMER CAN DELETE ONLY OWN PRODUCT
        if (user.getRole().getName().equals("FARMER")
                && !product.getFarmer().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You can delete only your own products");
        }

        productRepository.delete(product);
        return ResponseEntity.ok("Product deleted successfully");
    }

    // ✅ ALL ROLES → VIEW PRODUCTS
    @GetMapping
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }


    // ✅ ALL ROLES → VIEW PRODUCT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return ResponseEntity.ok(mapToDTO(product));
    }


    private ProductResponseDTO mapToDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getQuantity(),
                product.getCategory().getName(),
                new FarmerDTO(
                        product.getFarmer().getId(),
                        product.getFarmer().getName(),
                        product.getFarmer().getEmail()
                )
        );
    }
    // 🔍 SEARCH & FILTER PRODUCTS
    @GetMapping("/search")
    public List<ProductResponseDTO> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {

        List<Product> products;

        if (name != null && category != null) {
            products = productRepository
                    .findByNameContainingIgnoreCaseAndCategory_NameIgnoreCase(name, category);

        } else if (category != null && minPrice != null && maxPrice != null) {
            products = productRepository
                    .findByCategory_NameIgnoreCaseAndPriceBetween(category, minPrice, maxPrice);

        } else if (name != null) {
            products = productRepository
                    .findByNameContainingIgnoreCase(name);

        } else if (category != null) {
            products = productRepository
                    .findByCategory_NameIgnoreCase(category);

        } else if (minPrice != null && maxPrice != null) {
            products = productRepository
                    .findByPriceBetween(minPrice, maxPrice);

        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::mapToDTO)
                .toList();
    }

}
