package com.gamezone.ecomsystem.mapper;

import com.gamezone.ecomsystem.dto.GameDto;
import com.gamezone.ecomsystem.model.Game;

public class GameMapper {
    public static GameDto toDto(Game game) {
        GameDto dto = new GameDto();
        dto.setId(game.getId());
        dto.setName(game.getName());
        dto.setPrice(game.getPrice());
        dto.setDescription(game.getDescription());
        return dto;
    }
}