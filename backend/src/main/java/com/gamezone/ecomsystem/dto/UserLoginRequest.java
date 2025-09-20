package com.gamezone.ecomsystem.dto;

import jakarta.validation.constraints.NotBlank;

public class UserLoginRequest {
    
    @NotBlank(message = "Email is required")
    private String email;
    
    public UserLoginRequest() {}
    
    public UserLoginRequest(String email) {
        this.email = email;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}
