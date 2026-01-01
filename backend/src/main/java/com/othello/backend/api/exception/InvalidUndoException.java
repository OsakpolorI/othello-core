package com.othello.backend.api.exception;

public class InvalidUndoException extends RuntimeException {
    public InvalidUndoException() {
        super("Invalid undo");
    }
}
