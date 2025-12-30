import java.util.ArrayList;
import java.util.Random;

/**
 * PlayerRandom makes a move by first determining all possible moves that this
 * player can make, putting them in an ArrayList, and then randomly choosing one
 * of them.
 * 
 * @author arnold
 *
 */


/**
 * The Player class is an abstract base for all types of Othello players.
 * It stores who the player is and gives a structure for making moves.
 */
abstract class Player {
    protected final Othello othello;
    protected final char player;

    /**
     * Builds a new player in the given Othello game.
     *
     * @param othello the current Othello game
     * @param player the character representing this player (P1 or P2)
     */
    public Player(Othello othello, char player) {
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
}

/**
 * The PlayerRandom class represents a player that makes random valid moves in Othello.
 * It finds all possible moves and picks one at random.
 */

public class PlayerRandom extends Player {
	
	private final Random rand = new Random();

    /**
     * Builds a new random player in the given Othello game.
     *
     * @param othello the current Othello game
     * @param player the character representing this player (P1 or P2)
     */

    public PlayerRandom(Othello othello, char player) {
        super(othello, player);
    }

    /**
     * Picks and returns a random valid move for this player.
     * If no valid moves are available, it returns null.
     *
     * @return a random Move for this player, or null if no moves are possible
     */
	public Move getMove() {
        ArrayList<int[]> moves = new ArrayList<>();

        for (int row = 0; row < othello.othelloBoard.getDimension(); row++) {
            for (int col = 0; col < othello.othelloBoard.getDimension(); col++) {
                int tokens = PlayerGreedy.getToken(othello, player, row, col);
                if (tokens > 0) moves.add(new int[]{row, col});
            }
        }
        if (moves.isEmpty()) {
            return null;
        }
        int randInt = rand.nextInt(moves.size());
        int[] cell = moves.get(randInt);
        return new Move(cell[0], cell[1]);
	}
}
