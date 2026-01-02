package com.othello.backend.api.service;

import com.othello.backend.api.dto.MoveResponseDTO;
import com.othello.backend.api.exception.*;
import com.othello.backend.engine.*;
import com.othello.backend.strategy.HumanStrategy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.othello.backend.strategy.Strategy;
import com.othello.backend.strategy.StrategyFactory;

@Service


public class GameService {

    // Stores games in memory: UserID -> Game Instance
    private final Map<String, OthelloGameEngine> games = new ConcurrentHashMap<>();
    private final StrategyFactory factory = new StrategyFactory();;

    public MoveResponseDTO createNewGame(String userId, String strategy) {
        if (games.containsKey(userId)) {
            throw new GameInProgessException();
        }
        Othello game = new Othello();
        HumanStrategy p1 = new HumanStrategy(game, OthelloBoard.P1);
        Strategy p2 = factory.createStrategy(game, strategy);

        OthelloGameEngine gameEngine = new OthelloGameEngine(game, p1, p2);
        MoveResult result = gameEngine.getGameState();
        games.put(userId, gameEngine);

        return new MoveResponseDTO(result);
    }

    public MoveResponseDTO getGameEngine(String userId) {
        OthelloGameEngine gameEngine = games.get(userId);
        if (gameEngine == null) {
            throw new GameNotFoundException(userId);
        }
        return new MoveResponseDTO(gameEngine.getGameState());
    }

    public List<MoveResponseDTO> makeMove(String userId, int row, int col) {
        OthelloGameEngine gameEngine = games.get(userId);
        ArrayList<MoveResponseDTO> moves = new ArrayList<>();
        if (gameEngine == null) throw new GameNotFoundException(userId);

        MoveCommand moveCommand = new MoveCommand(gameEngine.getGame(), new Move(row, col), gameEngine.getPlayer1().getPlayer());
        MoveResult result = gameEngine.executeMove(moveCommand); // Logic from Day 1-3
        moves.add(new MoveResponseDTO(result));
        if (!result.isSuccess()) {
            throw new InvalidMoveException();
        }
        else if (result.isGameOver() || result.getNextTurn() == OthelloBoard.P1) {
            return moves;
        }

        while(result.getNextTurn() == OthelloBoard.P2) {
            moveCommand = new MoveCommand(
                    gameEngine.getGame(),
                    gameEngine.getPlayer2().getMove(),
                    gameEngine.getPlayer2().getPlayer());
            result = gameEngine.executeMove(moveCommand);
            moves.add(new MoveResponseDTO(result));
        }
        return moves;
    }

    public List<MoveResponseDTO> undoMove(String userId) {
        OthelloGameEngine gameEngine = games.get(userId);
        ArrayList<MoveResponseDTO> moves = new ArrayList<>();
        if (gameEngine == null) throw new GameNotFoundException(userId);

        moves.add(new MoveResponseDTO(gameEngine.undoMove()));
        MoveResult result = gameEngine.undoMove();
        moves.add(new MoveResponseDTO(result));

        if (!result.isSuccess()) throw new InvalidUndoException();
        return moves;
    }

    public List<MoveResponseDTO> redoMove(String userId) {
        OthelloGameEngine gameEngine = games.get(userId);
        ArrayList<MoveResponseDTO> moves = new ArrayList<>();
        if (gameEngine == null) throw new GameNotFoundException(userId);

        moves.add(new MoveResponseDTO(gameEngine.redoMove()));
        MoveResult result = gameEngine.redoMove();
        moves.add(new MoveResponseDTO(result));

        if (!result.isSuccess()) throw new InvalidRedoException();
        return moves;
    }
}
