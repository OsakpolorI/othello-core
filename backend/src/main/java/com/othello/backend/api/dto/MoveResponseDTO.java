package com.othello.backend.api.dto;

import com.othello.backend.engine.MoveResult;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MoveResponseDTO {
    private final boolean success;
    private final char nextTurn;
    private final char[][] board; // simplified version of OthelloBoard
    private final boolean gameOver;

    public MoveResponseDTO(boolean success, char nextTurn, char[][] board, boolean gameOver) {
        this.success = success;
        this.nextTurn = nextTurn;
        this.board = board;
        this.gameOver = gameOver;
    }

    public MoveResponseDTO(MoveResult result) {
        success = result.isSuccess();
        nextTurn = result.getNextTurn();
        board = result.getGameState().getBoardCopy();
        gameOver = result.isGameOver();
    }
}
