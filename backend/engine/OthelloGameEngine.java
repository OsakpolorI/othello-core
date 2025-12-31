import java.util.ArrayList;

public class OthelloGameEngine {
    private Othello game;               // core game state
    private Strategy player1;
    private Strategy player2;
    public ArrayList<MoveCommand> history;  // moves done
    private ArrayList<MoveCommand> redoStack; // moves undone

    public OthelloGameEngine(Othello game, Strategy player1, Strategy player2) {
        this.game = game;
        this.player1 = player1;
        this.player2 = player2;
        this.history = new ArrayList<>();
        this.redoStack = new ArrayList<>();
    }

    public MoveResult executeMove(MoveCommand moveCommand) {
        MoveResult result = moveCommand.execute();
        if (result.isSuccess()) {
            history.add(moveCommand);
            redoStack.clear(); // redo is only for undone moves
        }
        return result;
    }

    // Can't undo game if game over
    public MoveResult undoMove() {
        if (history.isEmpty()) {
            return new MoveResult(false, game.getWhosTurn(), game.getBoard(), false);
        }
        MoveCommand last = history.removeLast();
        MoveResult result = last.undo();
        redoStack.add(last);
        return result;
    }

    public MoveResult redoMove() {
        if (redoStack.isEmpty()) {
            return new MoveResult(false, game.getWhosTurn(), game.getBoard(), false);
        }
        MoveCommand next = redoStack.removeLast();
        MoveResult result =  next.execute();
        history.add(next);
        return result;
    }

    public Strategy getCurrentPlayer() {
        return game.getWhosTurn() == 'B' ? player1 : player2;
    }

    public Othello getGame() {
        return game;
    }

    public static void main(String args[]) {
        // Create new game engine
        Othello o = new Othello();
        HumanStrategy p1 = new HumanStrategy(o, OthelloBoard.P1);
        RandomStrategy p2 = new RandomStrategy(o, OthelloBoard.P2);
        OthelloGameEngine gameEngine = new OthelloGameEngine(o, p1, p2);

        // Simulate getting move
        Move move = p1.getMove(); // Receive API request for new move

        MoveCommand moveCommand = new MoveCommand(o, move, p1.getPlayer());
        MoveResult result = gameEngine.executeMove(moveCommand);

        System.out.println(result.isSuccess());
        result = gameEngine.undoMove();
        System.out.println(result.isSuccess());

        System.out.println(o.getBoard().toString());
    }
}