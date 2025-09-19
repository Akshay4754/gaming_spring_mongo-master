package com.gamezone.ecomsystem.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gamezone.ecomsystem.exception.BusinessException;
import com.gamezone.ecomsystem.exception.ResourceNotFoundException;
import com.gamezone.ecomsystem.model.Game;
import com.gamezone.ecomsystem.repository.GameRepository;

import java.util.List;

@Service
public class GameService {
    private static final Logger log = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private GameRepository repo;

    public Game create(Game game) {
        log.info("Creating game: {}", game.getName());
        game.setId(null);
        
        // Set default values if not provided
        if (game.getStatus() == null || game.getStatus().trim().isEmpty()) {
            game.setStatus("ACTIVE");
        }
        if (game.getMinAge() == 0) {
            game.setMinAge(3); // Default minimum age
        }
        if (game.getPlatform() == null || game.getPlatform().trim().isEmpty()) {
            game.setPlatform("PC"); // Default platform
        }
        if (game.getDeveloper() == null || game.getDeveloper().trim().isEmpty()) {
            game.setDeveloper("Unknown Developer");
        }
        if (game.getPublisher() == null || game.getPublisher().trim().isEmpty()) {
            game.setPublisher("Unknown Publisher");
        }
        
        validate(game);
        Game savedGame = repo.save(game);
        log.info("Game created successfully with ID: {}", savedGame.getId());
        return savedGame;
    }

    public List<Game> findAll() {
        log.info("Finding all games");
        return repo.findAll();
    }

    public Game findById(String id) {
        log.info("Finding game by id: {}", id);
        return repo.findById(id)
                .orElseThrow(() -> {
                    log.error("Attempted to find non-existing game id: {}", id);
                    return new ResourceNotFoundException("Game not found with id: " + id);
                });
    }

    public Game update(String id, Game gameDetails) {
        log.info("Updating game by id: {}", id);
        Game existingGame = findById(id);

        existingGame.setName(gameDetails.getName());
        existingGame.setDescription(gameDetails.getDescription());
        existingGame.setPrice(gameDetails.getPrice());
        existingGame.setGenre(gameDetails.getGenre());
        existingGame.setStatus(gameDetails.getStatus());
        existingGame.setPlatform(gameDetails.getPlatform());
        existingGame.setMinAge(gameDetails.getMinAge());
        existingGame.setDeveloper(gameDetails.getDeveloper());
        existingGame.setPublisher(gameDetails.getPublisher());
        existingGame.setImageUrl(gameDetails.getImageUrl());
        existingGame.setReleaseDate(gameDetails.getReleaseDate());

        validate(existingGame);
        return repo.save(existingGame);
    }

    public void delete(String id) {
        log.info("Deleting game by id: {}", id);
        if (!repo.existsById(id)) {
            log.error("Attempted to delete non-existing game id: {}", id);
            throw new ResourceNotFoundException("Game not found with id: " + id);
        }
        repo.deleteById(id);
    }

    private void validate(Game game) {
        if (game.getName() == null || game.getName().trim().isEmpty()) {
            throw new BusinessException("Game name is required.");
        }
        if (game.getPrice() < 0) {
            throw new BusinessException("Price cannot be negative.");
        }
        if (game.getDescription() == null || game.getDescription().trim().isEmpty()) {
            throw new BusinessException("Game description is required.");
        }
        if (game.getGenre() == null || game.getGenre().trim().isEmpty()) {
            throw new BusinessException("Game genre is required.");
        }
        if (game.getStatus() == null || game.getStatus().trim().isEmpty()) {
            throw new BusinessException("Game status is required.");
        }
        if (!isValidStatus(game.getStatus())) {
            throw new BusinessException("Invalid game status. Must be ACTIVE, INACTIVE, or MAINTENANCE.");
        }
        if (game.getMinAge() < 0 || game.getMinAge() > 18) {
            throw new BusinessException("Minimum age must be between 0 and 18.");
        }
    }
    
    private boolean isValidStatus(String status) {
        return "ACTIVE".equals(status) || "INACTIVE".equals(status) || "MAINTENANCE".equals(status);
    }
}