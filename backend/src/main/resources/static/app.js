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
    const aiSelect  = document.querySelector("#ai-select");
    const undoBtn = document.getElementById('undo');
    const redoBtn = document.getElementById('redo');
    const hintBtn = document.getElementById('hint');

    if (localStorage.userId === undefined) {
        localStorage.userId = crypto.randomUUID();
    }
    const userId = localStorage.userId;

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
        let demoEval;
        // value: -1.0 (player huge advantage) to +1.0 (bot huge advantage)
        // Map to full bar height (400px total range)
        const maxHeight = 400; // Half bar = 200px (center to top/bottom)
        evalFill.style.height = `${value * maxHeight}px`;
    }

    async function handleMove(row, col) {
        let result = await postRequest('move', {
            row: row,
            column: col
        })

        if (!result) return;
        let firstMove = result.shift();
        turnText.innerText = (firstMove.nextTurn === 'X') ? 'YOUR MOVE' : "BOT'S MOVE";
        renderBoard(createBoard(firstMove));
        updateEvalBar((Math.random() - 0.5) * 1.6);

        for (let move of result) {
            await sleep(1.5);
            turnText.innerText = (move.nextTurn === 'X') ? 'YOUR MOVE' : "BOT'S MOVE";
            renderBoard(createBoard(move));
            updateEvalBar((Math.random() - 0.5) * 1.6);
        }
    }
    function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    async function postRequest(url, body = {}) {
        try {
            const response = await fetch(`/api/v1/games/${url}`, {
                method: 'POST',
                headers: {
                    'X-User-ID': userId,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `HTTP ${response.status}`);
            }
            return await response.json();
        } catch (err) {
            alert(err.message);
            return null;
        }
    }

    function createBoard(result) {
        console.log(result)
        let rawBoard = result.board;
        let board = []
        for (let row of rawBoard) {
            board.push(row.split('').map((cell) => {
                return (cell === ' ') ? 0 : (cell === 'X') ? 1 : 2
            }))
        }
        return board
    }

    function showStartScreen() {
        boardEl.style.backgroundColor = '#111';
        boardEl.style.border = 'none';
        startScreen.classList.remove('hidden');
        turnBar.classList.add('hidden');
        evalContainer.classList.add('hidden');
        boardEl.innerHTML = '';
        [newGameBtn, undoBtn, redoBtn, hintBtn].forEach((btn) => {
            btn.classList.add('hidden');
        });
        document.querySelectorAll('.coord-label').forEach(el => el.remove());
        updateEvalBar(0);
    }

    async function initGame() {
        const result = await postRequest('new', {
            strategy: aiSelect.value
        });
        if (!result) return;

        startScreen.classList.add('hidden');
        turnBar.classList.remove('hidden');
        evalContainer.classList.remove('hidden');
        [newGameBtn, undoBtn, redoBtn, hintBtn].forEach((btn) => {
            btn.classList.remove('hidden');
        });

        renderBoard(createBoard(result));
        updateEvalBar(0); // neutral at start
        turnText.innerText = "YOUR MOVE";
    }

    startBtn.addEventListener('click', initGame);
    newGameBtn.addEventListener('click', showStartScreen);

    showStartScreen();
});

