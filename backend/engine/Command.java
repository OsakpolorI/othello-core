public interface Command {
    public MoveResult execute();
    public MoveResult undo();
}
