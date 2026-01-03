package com.othello.backend.engine;

import java.util.ArrayList;
import java.util.List;

public class MoveCommand implements Command {
    private Othello game;
    private Move move;
    private char player;
    private MoveResult gameState;

    public MoveCommand(Othello game,  Move move, char player) {
        this.game = game;
        this.move = move;
        this.player = player;
    }

    public MoveResult execute() {
        gameState = new MoveResult(
                true, game.getWhosTurn(), new OthelloBoard(game.getBoard()), false,
                new ArrayList<>(List.of(game.getCount(OthelloBoard.P1), game.getCount(OthelloBoard.P2))));
        return game.move(player, move);
    }

    public MoveResult undo() {
        game.setBoard(gameState.getGameState());
        game.setTurn(gameState.getNextTurn());
        return new MoveResult(
                true, game.getWhosTurn(), game.getBoard(), false,
                new ArrayList<>(List.of(game.getCount(OthelloBoard.P1), game.getCount(OthelloBoard.P2))));
    }
}
