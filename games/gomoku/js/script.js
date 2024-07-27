const game = document.getElementById('game');
const message = document.getElementById('message');
const rollbackButton = document.getElementById('rollback');
const rows = 25;
const cols = 25;
let currentPlayer = 'x';
let board = Array(rows).fill(null).map(() => Array(cols).fill(null));
let moveHistory = [];

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => makeMove(i, j));
        game.appendChild(cell);
    }
}

rollbackButton.addEventListener('click', rollback);

function makeMove(row, col) {
    if (board[row][col] !== null) return;
    board[row][col] = currentPlayer;
    const cell = game.children[row * cols + col];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    moveHistory.push({ row, col, player: currentPlayer });

    if (checkWin(row, col)) {
        message.textContent = `${currentPlayer.toUpperCase()} wins!`;
        game.style.pointerEvents = 'none';
        return;
    }
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

function rollback() {
    if (moveHistory.length === 0) return;
    const lastMove = moveHistory.pop();
    board[lastMove.row][lastMove.col] = null;
    const cell = game.children[lastMove.row * cols + lastMove.col];
    cell.textContent = '';
    cell.classList.remove(lastMove.player);
    currentPlayer = lastMove.player;
    message.textContent = '';
    game.style.pointerEvents = 'auto';
}

function checkWin(row, col) {
    return checkDirection(row, col, 1, 0) ||
           checkDirection(row, col, 0, 1) ||
           checkDirection(row, col, 1, 1) ||
           checkDirection(row, col, 1, -1);
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 0;
    let r = row;
    let c = col;

    for (let i = 0; i < 5; i++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            r += rowDir;
            c += colDir;
        } else {
            break;
        }
    }

    r = row - rowDir;
    c = col - colDir;

    for (let i = 0; i < 4; i++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === currentPlayer) {
            count++;
            r -= rowDir;
            c -= colDir;
        } else {
            break;
        }
    }

    return count >= 5;
}
