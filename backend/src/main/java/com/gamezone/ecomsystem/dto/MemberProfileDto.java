package com.gamezone.ecomsystem.dto;

import java.util.List;

public class MemberProfileDto {
    private MemberDto member;
    private List<RechargeDto> recharge_history;
    private List<GameDto> games;
    private List<PlayedHistoryDto> played_history;

    // Getters and Setters
    public MemberDto getMember() { return member; }
    public void setMember(MemberDto member) { this.member = member; }
    public List<RechargeDto> getRecharge_history() { return recharge_history; }
    public void setRecharge_history(List<RechargeDto> recharge_history) { this.recharge_history = recharge_history; }
    public List<GameDto> getGames() { return games; }
    public void setGames(List<GameDto> games) { this.games = games; }
    public List<PlayedHistoryDto> getPlayed_history() { return played_history; }
    public void setPlayed_history(List<PlayedHistoryDto> played_history) { this.played_history = played_history; }
}