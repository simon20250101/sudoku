
// 全局变量
let grid = [];
let solutionGrid = [];
let initialBoard = [];
let timerInterval;
let timeLeft;
let board;
let difficulty = 'easy';
let selectedCell = null;

// 初始化游戏
function startNewGame() {
    difficulty = document.getElementById('difficulty').value;
    timeLeft = difficulty === 'easy' ? 600 : difficulty === 'medium' ? 450 : 300;
    document.getElementById('timer').textContent = `剩余时间: ${formatTime(timeLeft)}`;
    clearInterval(timerInterval);
    startTimer();
    generateSudokuBoard();
}

// 数独生成逻辑
function generateCompleteBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
}

function fillBoard(board) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true;
    const [row, col] = emptyCell;

    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of numbers) {
        if (isValidNumber(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function isValidNumber(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num ||
            board[Math.floor(row / 3) * 3 + Math.floor(i / 3)]
                [Math.floor(col / 3) * 3 + (i % 3)] === num) {
            return false;
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function findEmptyCell(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function removeNumbers(board, difficulty) {
    let attempts = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;
    while (attempts > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            attempts--;
        }
    }
}

function generateSudokuBoard() {
    board = generateCompleteBoard();
    solutionGrid = JSON.parse(JSON.stringify(board));
    removeNumbers(board, difficulty);
    initialBoard = JSON.parse(JSON.stringify(board));
    renderBoard();
}

// 渲染数独
function renderBoard() {
    const gridContainer = document.getElementById('sudoku-grid');
    gridContainer.innerHTML = '';
    grid = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.textContent = board[i][j] !== 0 ? board[i][j] : '';
            cell.className = board[i][j] !== 0 ? 'fixed' : '';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.onclick = board[i][j] === 0 ? () => showNumberSelector(cell) : null;
            grid.push(cell);
            gridContainer.appendChild(cell);
        }
    }
}

// 显示数字选择器
function showNumberSelector(cell) {
    selectedCell = cell;
    const selector = document.getElementById('number-selector');
    selector.innerHTML = '';
    selector.style.display = 'grid';
    selector.style.top = `${cell.offsetTop + 50}px`;
    selector.style.left = `${cell.offsetLeft}px`;
    for (let i = 1; i <= 9; i++) {
        const numberCell = document.createElement('div');
        numberCell.textContent = i;
        numberCell.onclick = () => {
            const row = selectedCell.dataset.row;
            const col = selectedCell.dataset.col;
            board[row][col] = i;
            selectedCell.textContent = i;
            selector.style.display = 'none';
        };
        selector.appendChild(numberCell);
    }
}

// 隐藏数字选择器
function hideNumberSelector() {
    document.getElementById('number-selector').style.display = 'none';
}

// 提示功能
function giveHint() {
    const emptyCells = grid.filter(cell => !cell.classList.contains('fixed') && cell.textContent === '');
    if (emptyCells.length === 0) {
        alert('已经没有空格需要提示了！');
        return;
    }
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const row = randomCell.dataset.row;
    const col = randomCell.dataset.col;
    const correctValue = solutionGrid[row][col];
    board[row][col] = correctValue;
    randomCell.textContent = correctValue;
}

// 检查解答
function checkSolution() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== solutionGrid[i][j]) {
                alert('解答错误！请再试一次。');
                return;
            }
        }
    }
    alert('恭喜，你完成了数独！');
}

// 倒计时功能
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `剩余时间: ${formatTime(timeLeft)}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('时间到！请重新开始游戏。');
        }
    }, 1000);
}

// 格式化时间
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// 重置游戏
function resetGame() {
    board = JSON.parse(JSON.stringify(initialBoard));
    renderBoard();
}

// 初始化游戏
startNewGame();