package com.othello.backend.api.controller;

import com.othello.backend.api.service.GameService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import com.othello.backend.api.dto.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/games")
@CrossOrigin
public class GameController {
    @Autowired
    private GameService gameService;

    @PostMapping("/new")
    public ResponseEntity<MoveResponseDTO> newGame(
            @RequestHeader("X-User-ID") String userId,
            @RequestBody NewGameRequestDTO request) {
        return ResponseEntity.ok(gameService.createNewGame(userId, request.getStrategy()));
    }

    @GetMapping("/state")
    public ResponseEntity<MoveResponseDTO> getState(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(gameService.getGameEngine(userId));
    }

    @PostMapping("/move")
    public ResponseEntity<List<MoveResponseDTO>> move(
            @RequestHeader("X-User-ID") String userId,
            @RequestBody MoveRequestDTO request) {
        return ResponseEntity.ok(gameService.makeMove(userId, request.getRow(), request.getColumn()));
    }

    @PostMapping("/undo")
    public ResponseEntity<List<MoveResponseDTO>> undoMove(@RequestHeader("X-User-ID")  String userId) {
        return ResponseEntity.ok(gameService.undoMove(userId));
    }

    @PostMapping("/redo")
    public ResponseEntity<List<MoveResponseDTO>> redoMove(@RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(gameService.redoMove(userId));
    }
}
