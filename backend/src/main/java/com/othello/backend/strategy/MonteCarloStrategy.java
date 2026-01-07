package com.othello.backend.strategy;

import com.othello.backend.engine.Move;
import com.othello.backend.engine.Othello;
import com.othello.backend.engine.OthelloBoard;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class MonteCarloStrategy extends Strategy {

    public MonteCarloStrategy(Othello othello, char player) {
        super(othello, player);
    }

    @Override
    public Move getMove() {
        Othello othelloSim = new Othello();
        int numOfSimulations = 125;

        RandomStrategy moveGen = new RandomStrategy(othello, player);
        ArrayList<Move> possibleMoves = moveGen.getPossibleMoves();

        int simulationsPerMove = numOfSimulations / possibleMoves.size();
        int[] winMap = new int[possibleMoves.size()];

        for (int index = 0; index < possibleMoves.size(); index++) {
            for (int i = 0; i < simulationsPerMove; i++) {
                othelloSim.setBoard(new OthelloBoard(othello.getBoard()));
                othelloSim.setTurn(player);

                RandomStrategy p1 = new RandomStrategy(othelloSim, OthelloBoard.P1);
                RandomStrategy p2 = new RandomStrategy(othelloSim, OthelloBoard.P2);

                othelloSim.move(player, possibleMoves.get(index));

                char winner = othelloSim.simulate(p1, p2);
                if (winner == player) {
                    winMap[index]++;
                }
            }
        }

        int winningIndex = 0;
        for (int i = 1; i < winMap.length; i++) {
            if (winMap[i] > winMap[winningIndex]) {
                winningIndex = i;
            }
        }

        return possibleMoves.get(winningIndex);
    }

}
