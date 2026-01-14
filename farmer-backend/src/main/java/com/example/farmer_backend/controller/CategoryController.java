package com.example.farmer_backend.controller;

import com.example.farmer_backend.model.Category;
import com.example.farmer_backend.repository.CategoryRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // ✅ Public dropdown (needed for registration/product add)
    @GetMapping("/public")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // 🔐 ADMIN ONLY
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Category create(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Category update(@PathVariable Long id, @RequestBody Category body) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(body.getName());
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
    }
}
