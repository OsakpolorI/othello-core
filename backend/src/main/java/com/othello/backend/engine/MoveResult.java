package com.othello.backend.engine;

import java.util.ArrayList;

public class MoveResult {
    private final boolean success;
    private final char nextTurn;
    private final OthelloBoard gameState;
    private final boolean gameOver;
    private final ArrayList<Integer> piecesCount;

    public MoveResult(boolean success, char nextTurn, OthelloBoard gameState, boolean gameOver, ArrayList<Integer> piecesCount) {
        this.success = success;
        this.nextTurn = nextTurn;
        this.gameState = gameState;
        this.gameOver = gameOver;
        this.piecesCount = piecesCount;
    }

    public boolean isSuccess() { return success; }
    public char getNextTurn() { return nextTurn; }
    public boolean isGameOver() { return gameOver; }
    public OthelloBoard getGameState() { return gameState; }
    public ArrayList<Integer> getPiecesCount() { return piecesCount; }
}