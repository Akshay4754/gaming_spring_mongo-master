package com.gamezone.ecomsystem.repository;

import com.gamezone.ecomsystem.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List; // <-- Make sure this is imported

public interface GameRepository extends MongoRepository<Game, String> {
    
    List<Game> findByStatus(String status);
    List<Game> findByGenre(String genre);
    List<Game> findByPlatform(String platform);
    List<Game> findByNameContainingIgnoreCase(String name);
    List<Game> findByPriceBetween(double minPrice, double maxPrice);
    List<Game> findByStatusAndGenre(String status, String genre);
    
}