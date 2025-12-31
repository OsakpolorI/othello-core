package com.othello.backend.engine;

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
        gameState = new MoveResult(true, game.getWhosTurn(), new OthelloBoard(game.getBoard()), false);
        return game.move(player, move);
    }

    public MoveResult undo() {
        game.setBoard(gameState.getGameState());
        game.setTurn(gameState.getNextTurn());
        return new MoveResult(true, game.getWhosTurn(), game.getBoard(), false);
    }
}
