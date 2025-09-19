package com.gamezone.ecomsystem.dto;

import java.util.Date;

public class MemberDto {
    private String id;
    private String name;
    private String phoneNumber;
    private String email;
    private double balance;
    private Date joiningDate;
    private boolean isActive;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
    public Date getJoiningDate() { return joiningDate; }
    public void setJoiningDate(Date joiningDate) { this.joiningDate = joiningDate; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}