document.addEventListener('DOMContentLoaded', () => {
    const boardEl = document.getElementById('board');
    const boardWrapper = document.getElementById('board-wrapper');
    const startScreen = document.getElementById('start-screen');
    const turnBar = document.getElementById('turn-indicator-bar');
    const evalContainer = document.getElementById('eval-container');
    const startBtn = document.getElementById('start-game');
    const newGameBtn = document.getElementById('new-game');
    const turnText = document.getElementById('turn-text');
    const evalFill = document.getElementById('eval-fill');

    function addCoordinates() {
        document.querySelectorAll('.coord-label').forEach(el => el.remove());

        for (let i = 0; i < 8; i++) {
            const colLabel = document.createElement('div');
            colLabel.classList.add('coord-label', 'col-label');
            colLabel.textContent = i + 1;
            colLabel.style.left = `${42 + i * 60 + 30}px`;
            colLabel.style.top = '15px';
            boardWrapper.appendChild(colLabel);

            const rowLabel = document.createElement('div');
            rowLabel.classList.add('coord-label', 'row-label');
            rowLabel.textContent = i + 1;
            rowLabel.style.top = `${42 + i * 60 + 30}px`;
            rowLabel.style.left = '20px';
            boardWrapper.appendChild(rowLabel);
        }
    }

    function renderBoard(boardState) {
        boardEl.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.onclick = () => handleMove(row, col);

                if (boardState[row][col] !== 0) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', boardState[row][col] === 1 ? 'black' : 'white');
                    cell.appendChild(piece);
                }
                boardEl.appendChild(cell);
            }
        }
        addCoordinates();
    }

    function updateEvalBar(value) {
        // value: -1.0 (player huge advantage) to +1.0 (bot huge advantage)
        // Map to full bar height (400px total range)
        const maxHeight = 400; // Half bar = 200px (center to top/bottom)
        evalFill.style.height = `${value * maxHeight}px`;
    }

    function handleMove(r, c) {
        console.log(`Move at (${r}, ${c})`);
        turnText.innerText = turnText.innerText === "YOUR MOVE" ? "BOT'S MOVE" : "YOUR MOVE";

        // Demo: random eval between -0.8 and +0.8
        const demoEval = (Math.random() - 0.5) * 1.6;
        updateEvalBar(demoEval);
    }

    function initGame() {
        startScreen.classList.add('hidden');
        turnBar.classList.remove('hidden');
        evalContainer.classList.remove('hidden');

        const initialBoard = Array(8).fill().map(() => Array(8).fill(0));
        initialBoard[3][3] = 2; initialBoard[3][4] = 1;
        initialBoard[4][3] = 1; initialBoard[4][4] = 2;

        renderBoard(initialBoard);
        updateEvalBar(0); // neutral at start
        turnText.innerText = "YOUR MOVE";
    }

    function showStartScreen() {
        boardEl.style.backgroundColor = '#111';
        boardEl.style.border = 'none';
        startScreen.classList.remove('hidden');
        turnBar.classList.add('hidden');
        evalContainer.classList.add('hidden');
        boardEl.innerHTML = '';
        document.querySelectorAll('.coord-label').forEach(el => el.remove());
        updateEvalBar(0);
    }

    startBtn.addEventListener('click', initGame);
    newGameBtn.addEventListener('click', showStartScreen);

    showStartScreen();
});

