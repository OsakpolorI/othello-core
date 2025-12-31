package com.othello.backend.api.controller;

import com.othello.backend.api.dto.MoveResponseDTO;
import com.othello.backend.api.exception.GameNotFoundException;
import com.othello.backend.engine.Move;
import com.othello.backend.engine.MoveCommand;
import com.othello.backend.engine.MoveResult;
import com.othello.backend.engine.OthelloGameEngine;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service


public class GameService {

    // Stores games in memory: UserID -> Game Instance
    private final Map<String, OthelloGameEngine> games = new ConcurrentHashMap<>();

    public MoveResponseDTO getGameEngine(String userId) {
        OthelloGameEngine gameEngine = games.get(userId);
        if (gameEngine == null) {
            throw new GameNotFoundException(userId);
        }
        return new MoveResponseDTO(gameEngine.getGameState());
    }

    public MoveResponseDTO makeMove(String userId, int row, int col) {
        OthelloGameEngine gameEngine = games.get(userId);
        if (gameEngine == null) throw new GameNotFoundException(userId);

        MoveCommand moveCommand = new MoveCommand(gameEngine.getGame(), new Move(row, col), gameEngine.getPlayer1().getPlayer());
        MoveResult result = gameEngine.executeMove(moveCommand); // Logic from Day 1-3

        return new MoveResponseDTO(result);
    }
}
