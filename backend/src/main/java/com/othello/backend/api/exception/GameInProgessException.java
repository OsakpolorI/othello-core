package com.othello.backend.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class GameInProgessException extends RuntimeException {
    public GameInProgessException() {
        super("Game already exists.");
    }
}
