package com.othello.backend.engine;

public interface Command {
    public MoveResult execute();
    public MoveResult undo();
}
