/**
 * Represents a move on the Othello board with a row and column position.
 */
public class Move {
	private final int row, col;

	public Move(int row, int col) {
		this.row = row;
		this.col = col;
	}

	public int getRow() { return row; }
	public int getCol() { return col; }

    // Returns the string representation of the move in the format (row, col)
	public String toString() {
		return "(" + this.row + "," + this.col + ")";
	}
}
