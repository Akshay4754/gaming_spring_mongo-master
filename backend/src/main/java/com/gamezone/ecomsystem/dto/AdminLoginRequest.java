package com.gamezone.ecomsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminLoginRequest {
    
    @NotBlank(message = "Username is required")
    private String username;
    
    public AdminLoginRequest() {}
    
    public AdminLoginRequest(String username) {
        this.username = username;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
}
