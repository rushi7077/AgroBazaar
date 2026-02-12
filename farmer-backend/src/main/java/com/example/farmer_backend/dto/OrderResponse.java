package com.example.farmer_backend.dto;

import java.util.List;

public class OrderResponse {
    public Long id;
    public String status;
    public double totalAmount;
    public List<OrderItemResponse> items;
    public int displayOrderNo;

    public String userName;
    public String userEmail;


}
