package com.othello.backend.api.exception;

public class InvalidMoveException extends RuntimeException {
    public InvalidMoveException() {
        super("Invalid move");
    }
}
