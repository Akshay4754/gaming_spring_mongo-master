package com.gamezone.ecomsystem.mapper;

import com.gamezone.ecomsystem.dto.RechargeDto;
import com.gamezone.ecomsystem.model.Recharge;

public class RechargeMapper {
    public static RechargeDto toDto(Recharge recharge) {
        RechargeDto dto = new RechargeDto();
        dto.setId(recharge.getId());
        dto.setAmount(recharge.getAmount());
        dto.setDateTime(recharge.getDate());
        return dto;
    }
}