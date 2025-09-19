package com.gamezone.ecomsystem.dto;

import java.util.Date;

public class PlayedHistoryDto {
    private String id;
    private Date date_time;
    private String game_name;
    private double amount;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Date getDate_time() { return date_time; }
    public void setDate_time(Date date_time) { this.date_time = date_time; }
    public String getGame_name() { return game_name; }
    public void setGame_name(String game_name) { this.game_name = game_name; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}