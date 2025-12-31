package com.othello.backend.engine;

import com.othello.backend.strategy.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.Scanner;

public class OthelloGameEngine {
    @Getter
    private Othello game;               // core game state
    @Getter
    private final Strategy player1;
    @Getter
    private final Strategy player2;
    public ArrayList<MoveCommand> history;  // moves done
    private ArrayList<MoveCommand> redoStack; // moves undone
    @Getter
    private MoveResult gameState;

    public OthelloGameEngine(Othello game, Strategy player1, Strategy player2) {
        this.game = game;
        this.player1 = player1;
        this.player2 = player2;
        this.history = new ArrayList<>();
        this.redoStack = new ArrayList<>();
        this.gameState = new MoveResult(true, game.getWhosTurn(), game.getBoard(), false);
    }

    public MoveResult executeMove(MoveCommand moveCommand) {
        MoveResult result = moveCommand.execute();
        if (result.isSuccess()) {
            history.add(moveCommand);
            redoStack.clear(); // redo is only for undone moves
        }
        gameState = result;
        return result;
    }

    // Can't undo game if game over
    public MoveResult undoMove() {
        if (history.isEmpty() || game.isGameOver()) {
            return new MoveResult(false, game.getWhosTurn(), game.getBoard(), false);
        }
        MoveCommand last = history.removeLast();
        MoveResult result = last.undo();
        redoStack.add(last);
        gameState = result;
        return result;
    }

    public MoveResult redoMove() {
        if (redoStack.isEmpty()) {
            return new MoveResult(false, game.getWhosTurn(), game.getBoard(), false);
        }
        MoveCommand next = redoStack.removeLast();
        MoveResult result =  next.execute();
        history.add(next);
        gameState = result;
        return result;
    }

    public Strategy getCurrentPlayer() {
        return game.getWhosTurn() == 'B' ? player1 : player2;
    }

    public static void main(String[] args) {
        Othello game = new Othello();

        HumanStrategy p1 = new HumanStrategy(game, OthelloBoard.P1);
        RandomStrategy p2 = new RandomStrategy(game, OthelloBoard.P2);

        OthelloGameEngine engine = new OthelloGameEngine(game, p1, p2);
        Scanner scanner = new Scanner(System.in);

        char turn = game.getWhosTurn();
        boolean p1Passed = false;
        boolean p2Passed = false;

        System.out.println("Starting Othello");
        System.out.println(game.getBoard());

        while (true) {

            // =======================
            // PLAYER 1 (HUMAN)
            // =======================
            if (turn == OthelloBoard.P1) {

                System.out.println("Your turn (B)");

                // Optional undo / redo
                System.out.print("Undo last move? (y/n): ");
                if (scanner.nextLine().equalsIgnoreCase("y")) {
                    MoveResult undo = engine.undoMove();
                    undo = engine.undoMove();
                    System.out.println(undo.getGameState());
                    turn = undo.getNextTurn();
                    continue;
                }

                System.out.print("Redo move? (y/n): ");
                if (scanner.nextLine().equalsIgnoreCase("y")) {
                    MoveResult redo = engine.redoMove();
                    System.out.println(redo.getGameState());
                    turn = redo.getNextTurn();
                    continue;
                }

                // Get human move
                Move move = p1.getMove();

                if (move == null) {
                    System.out.println("No valid moves for Player 1. Passing.");
                    p1Passed = true;
                    turn = OthelloBoard.P2;
                    if (p1Passed && p2Passed) break;
                    continue;
                }

                MoveCommand command = new MoveCommand(game, move, OthelloBoard.P1);
                MoveResult result = engine.executeMove(command);

                System.out.println(result.getGameState());

                if (!result.isSuccess()) {
                    System.out.println("Invalid move, try again.");
                    continue;
                }

                p1Passed = (result.getNextTurn() == OthelloBoard.P1);
                turn = result.getNextTurn();
            }

            // =======================
            // PLAYER 2 (RANDOM)
            // =======================
            else {
                System.out.println("Random AI turn (W)");

                Move move = p2.getMove();

                if (move == null) {
                    System.out.println("Player 2 has no valid moves. Passing.");
                    p2Passed = true;
                    turn = OthelloBoard.P1;
                    if (p1Passed && p2Passed) break;
                    continue;
                }

                MoveCommand command = new MoveCommand(game, move, OthelloBoard.P2);
                MoveResult result = engine.executeMove(command);

                System.out.println(game.getBoard());

                p2Passed = (result.getNextTurn() == OthelloBoard.P2);
                turn = result.getNextTurn();
            }
        }

        // =======================
        // GAME OVER
        // =======================
        System.out.println("Game over.");
        System.out.println(game.getBoard());

        int p1Score = game.getBoard().getCount(OthelloBoard.P1);
        int p2Score = game.getBoard().getCount(OthelloBoard.P2);

        System.out.println("Final score:");
        System.out.println("Player 1 (B): " + p1Score);
        System.out.println("Player 2 (W): " + p2Score);
    }
}