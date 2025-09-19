package com.gamezone.ecomsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gamezone.ecomsystem.model.Game;
import com.gamezone.ecomsystem.service.GameService;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/games")
public class GameController {

    @Autowired
    private GameService service; // <-- Key change: Inject GameService

    @PostMapping
    public ResponseEntity<Game> create(@Valid @RequestBody Game game) {
        Game createdGame = service.create(game);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGame);
    }

    @GetMapping
    public ResponseEntity<List<Game>> findAll() {
        List<Game> games = service.findAll();
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> findById(@PathVariable String id) {
        Game game = service.findById(id);
        return ResponseEntity.ok(game);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> update(@PathVariable String id, @Valid @RequestBody Game game) {
        Game updatedGame = service.update(id, game);
        return ResponseEntity.ok(updatedGame);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}