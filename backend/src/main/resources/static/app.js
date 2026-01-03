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
    const blackCount = document.getElementById("black-count");
    const whiteCount = document.getElementById("white-count");
    const gameOverBanner = document.getElementById('game-over-banner');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const newGameFromOverBtn = document.getElementById('new-game-from-over');
    let inputLocked = false;

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
                cell.addEventListener('click', () =>
                    handleMoveAction('move', { row, column: col })
                );

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

    async function handleMoveAction(action, body = {}) {
        if (inputLocked) return
        let result = await postRequest(action, body);
        if (!result) return;
        console.log(result)
        let firstMove = result.shift();

        turnText.innerText = (firstMove.nextTurn === 'X') ? 'YOUR MOVE' : "BOT'S MOVE";
        renderBoard(createBoard(firstMove));
        updatePiecesCount(firstMove);
        updateEvalBar((Math.random() - 0.5) * 1.6);

        for (let move of result) {
            inputLocked = true;
            await sleep(1);
            turnText.innerText = (move.nextTurn === 'X') ? 'YOUR MOVE' : "BOT'S MOVE";
            renderBoard(createBoard(move));
            updatePiecesCount(move);
            updateEvalBar((Math.random() - 0.5) * 1.6);
            inputLocked = false;
        }

        if (firstMove.gameOver || (result.length > 0 && result.at(-1).gameOver)) {
            const lastResult = result[result.length - 1] || firstMove;
            return handleGameOver(lastResult);
        }
    }

    function updatePiecesCount(result) {
        //console.log(result, result.piecesCount)
        blackCount.textContent = result.piecesCount[0];
        whiteCount.textContent = result.piecesCount[1];
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
            if (url === 'new') {
                let result = confirm('Do you want to delete your active session?')
                if (result) await deleteRequest();
            }
            return null;
        }
    }

    function createBoard(result) {
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
        updatePiecesCount(result);
        updateEvalBar(0); // neutral at start
        turnText.innerText = "YOUR MOVE";
        inputLocked = false;
    }

    async function handleGameOver(result) {
        deleteRequest();
        await sleep(1.5);

        // Determine winner from last move result
        let winner = 'draw';
        if (result.piecesCount[0] > result.piecesCount[1]) {
            winner = 'player'; // Black (player) has more
        } else if (result.piecesCount[1] > result.piecesCount[0]) {
            winner = 'bot';    // White (bot) has more
        }
        showGameOver(winner);
    }

    function showGameOver(winner) {
        inputLocked = true;
        gameOverBanner.classList.remove('hidden');

        if (winner === 'player') {
            gameOverMessage.textContent = 'You Win!';
            gameOverMessage.classList.remove('loss');
            gameOverMessage.classList.add('win');
        } else if (winner === 'bot') {
            gameOverMessage.textContent = 'Computer Wins';
            gameOverMessage.classList.remove('win');
            gameOverMessage.classList.add('loss');
        } else {
            gameOverMessage.textContent = 'Draw';
            gameOverMessage.classList.remove('win', 'loss');
        }
    }

    async function deleteRequest() {
        try {
            const response = await fetch(`/api/v1/games`, {
                method: 'DELETE',
                headers: {
                    'X-User-ID': userId,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `HTTP ${response.status}`);
            }
        } catch (err) {
            alert(err.message);
            return null;
        }
    }
    startBtn.addEventListener('click', initGame);
    newGameBtn.addEventListener('click', showStartScreen);
    undoBtn.addEventListener('click', () => handleMoveAction('undo'))
    redoBtn.addEventListener('click', () => handleMoveAction('redo'))
    newGameFromOverBtn.addEventListener('click', () => {
        gameOverBanner.classList.add('hidden');
        showStartScreen();
    });
    showStartScreen();
});

