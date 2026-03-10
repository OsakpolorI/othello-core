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
    const blackCount = document.getElementById("black-count");
    const whiteCount = document.getElementById("white-count");
    const gameOverBanner = document.getElementById('game-over-banner');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const newGameFromOverBtn = document.getElementById('new-game-from-over');
    const winRate = document.getElementById('win-rate');
    const notificationContainer = document.getElementById('notification-container');
    const moveSFX = new Audio('/audio/move.mp3');
    let inputLocked = false;

    if (localStorage.userId === undefined) {
        localStorage.userId = crypto.randomUUID();
    }
    const userId = localStorage.userId;

    function showNotification(message, type = 'error', duration = 5000, actionBtn = null) {
        const notification = document.createElement('div');
        notification.classList.add('error-notification', type);
        
        const messageEl = document.createElement('span');
        messageEl.textContent = message;
        notification.appendChild(messageEl);
        
        if (actionBtn) {
            notification.appendChild(actionBtn);
        }
        
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('error-notification-close');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => removeNotification(notification));
        notification.appendChild(closeBtn);
        
        notificationContainer.appendChild(notification);
        
        if (duration > 0) {
            setTimeout(() => removeNotification(notification), duration);
        }
    }

    function removeNotification(notification) {
        notification.classList.add('hidden');
        setTimeout(() => notification.remove(), 300);
    }

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

    async function updateEvalBar(value) {
        let probability = await postRequest('probability', {simulations: value})
        // value: -1.0 (player huge advantage) to +1.0 (bot huge advantage)
        // Map to full bar height (400px total range)
        const maxHeight = 400; // Half bar = 200px (center to top/bottom)
        evalFill.style.height = `${probability.winProbability * maxHeight}px`;
        winRate.textContent = Math.round(probability.winProbability * 100) + '%';
        console.log(probability)
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
        playMoveSound();
        await updateEvalBar(20);

        for (let move of result) {
            inputLocked = true;
            await sleep(aiSelect === 'MonteCarlo' ? 0.7 : 1);
            turnText.innerText = (move.nextTurn === 'X') ? 'YOUR MOVE' : "BOT'S MOVE";
            renderBoard(createBoard(move));
            updatePiecesCount(move);
            playMoveSound();
            await updateEvalBar(20);
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
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody.message || errorMessage;
                } catch {
                    // If response body isn't JSON, use status message
                }
                throw new Error(errorMessage);
            }
            return await response.json();
        } catch (err) {
            showNotification(err.message, 'error', 6000);
            if (url === 'new') {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete Session';
                deleteBtn.style.marginLeft = '10px';
                deleteBtn.style.padding = '4px 12px';
                deleteBtn.style.background = 'rgba(255,255,255,0.2)';
                deleteBtn.style.border = 'none';
                deleteBtn.style.borderRadius = '4px';
                deleteBtn.style.color = 'white';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.style.fontSize = '14px';
                deleteBtn.style.fontWeight = 'bold';
                deleteBtn.addEventListener('click', async () => {
                    await deleteRequest();
                    showNotification('Session deleted. You can now start a new game.', 'success', 4000);
                });
                
                showNotification('Failed to start new game. You have an active session.', 'warning', 0, deleteBtn);
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
        [newGameBtn, undoBtn, redoBtn].forEach((btn) => {
            btn.classList.add('hidden');
        });
        document.querySelectorAll('.coord-label').forEach(el => el.remove());
        evalFill.style.height = `${0.5 * 400}px`;
        winRate.textContent = 50 + '%';
    }

    async function initGame() {
        const result = await postRequest('new', {
            strategy: aiSelect.value
        });
        if (!result) return;

        startScreen.classList.add('hidden');
        turnBar.classList.remove('hidden');
        evalContainer.classList.remove('hidden');
        [newGameBtn, undoBtn, redoBtn].forEach((btn) => {
            btn.classList.remove('hidden');
        });

        renderBoard(createBoard(result));
        updatePiecesCount(result);// neutral at start
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
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody.message || errorMessage;
                } catch {
                    // If response body isn't JSON, use status message
                }
                throw new Error(errorMessage);
            }
        } catch (err) {
            showNotification(err.message, 'error', 5000);
            return null;
        }
    }

    function playMoveSound() {
        moveSFX.currentTime = 0; // Reset to start
        moveSFX.play();
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

