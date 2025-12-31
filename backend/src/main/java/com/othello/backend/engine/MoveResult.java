package com.othello.backend.engine;

public class MoveResult {
    private final boolean success;
    private final char nextTurn;
    private final OthelloBoard gameState;
    private final boolean gameOver;

    public MoveResult(boolean success, char nextTurn, OthelloBoard gameState, boolean gameOver) {
        this.success = success;
        this.nextTurn = nextTurn;
        this.gameState = gameState;
        this.gameOver = gameOver;
    }

    public boolean isSuccess() { return success; }
    public char getNextTurn() { return nextTurn; }
    public boolean isGameOver() { return gameOver; }
    public OthelloBoard getGameState() { return gameState; }
}