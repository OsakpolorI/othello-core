package com.othello.backend.strategy;

import com.othello.backend.engine.Othello;
import com.othello.backend.engine.Move;
/**
 * The strategy class is an abstract base for all types of Othello players.
 * It stores who the player is and gives a structure for making moves.
 */
public abstract class Strategy {
    protected final Othello othello;
    protected final char player;

    /**
     * Builds a new strategy in the given Othello game.
     *
     * @param othello the current Othello game
     * @param player  the character representing this player (P1 or P2)
     */
    public Strategy(Othello othello, char player) {
        this.othello = othello;
        this.player = player;
    }

    /**
     * Finds and returns the player's next move.
     * Each type of player decides the move in its own way.
     *
     * @return the chosen Move for this player
     */
    public abstract Move getMove();

    /**
     * Return the character of this player.
     */
    public char getPlayer() {
        return player;
    }
}
