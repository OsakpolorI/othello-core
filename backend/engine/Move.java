package ca.utoronto.utm.assignment1.othello;
/**
 * 
 * @author arnold
 *
 */
// TODO: Javadoc this class

/**
 * Represents a move on the Othello board with a row and column position.
 */
public class Move {
	private int row, col;
    /**
     * Creates a new move with the given row and column.
     *
     * @param row the row of the move
     * @param col the column of the move
     */
	public Move(int row, int col) {
		this.row = row;
		this.col = col;
	}
    /**
     * Returns the row of the move.
     * @return the row
     */
	public int getRow() {
		return row;
	}

    /**
     * Returns the col of the move.
     * @return the col
     */
	public int getCol() {
		return col;
	}

    /**
     * Returns the string representation of the move in the format (row, col)
     * @return the string representation of the move
     */

	public String toString() {
		return "(" + this.row + "," + this.col + ")";
	}
}
