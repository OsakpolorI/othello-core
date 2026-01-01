package com.othello.backend.api.exception;

public class InvalidRedoException extends RuntimeException {
    public InvalidRedoException() {
        super("Invalid redo");
    }
}
