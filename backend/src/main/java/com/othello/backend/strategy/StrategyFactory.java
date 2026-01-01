package com.othello.backend.strategy;

import com.othello.backend.engine.Othello;
import com.othello.backend.engine.OthelloBoard;

public class StrategyFactory {
    public Strategy createStrategy(Othello game, String product) {
        if (product.equals("Random")) {
            return new RandomStrategy(game, OthelloBoard.P2);
        }
        else if (product.equals("Greedy")) {
            return new  GreedyStrategy(game, OthelloBoard.P2);
        }
        return null;
    }
}

