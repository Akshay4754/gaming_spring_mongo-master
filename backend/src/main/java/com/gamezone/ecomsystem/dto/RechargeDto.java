package com.gamezone.ecomsystem.dto;

import java.util.Date;

public class RechargeDto {
    private String id;
    private double amount;
    private Date dateTime;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public Date getDateTime() { return dateTime; }
    public void setDateTime(Date dateTime) { this.dateTime = dateTime; }
}