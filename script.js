const output = document.getElementById('cli-output');
const input = document.getElementById('cli-input');
const browser = document.getElementById('internet-browser');

let state = 'LOGIN'; // States: LOGIN, COMMAND, TTT
let tttBoard = Array(9).fill('');

// Handle inputs
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        let val = input.value.trim();
        input.value = '';
        if (val === '') return;

        printText("\n> " + val);
        processCommand(val);
    }
});

function printText(text) {
    output.textContent += text + "\n";
    output.scrollTop = output.scrollHeight;
}

function processCommand(val) {
    let cleanVal = val.toLowerCase();

    // 1. LOGIN STATE
    if (state === 'LOGIN') {
        if (cleanVal === 'joshua') {
            state = 'COMMAND';
            printText("GREETINGS PROFESSOR FALKEN.\n\nSHALL WE PLAY A GAME?\n\nAvailable operations:\n- [games] : List available system titles\n- [browser] : Open Core Network View\n- [galaga] : Run tactical array emulation\n- [logout] : Drop carrier connection");
        } else {
            printText("IDENTIFICATION NOT RECOGNIZED BY CENTRAL TERMINAL.\nTRY AGAIN.");
        }
        return;
    }

    // 2. COMMAND MENU STATE
    if (state === 'COMMAND') {
        if (cleanVal === 'logout') {
            state = 'LOGIN';
            printText("CONNECTION TERMINATED.\n--- WOPR MULTI-FRAME SYSTEM ONLINE ---");
            return;
        }
        if (cleanVal === 'browser') {
            browser.style.display = 'flex';
            printText("LAUNCHING CORE INTERNET ROOT BROWSER WINDOW...");
            return;
        }
        if (cleanVal === 'galaga') {
            printText("\n*** GALAGA EASTER EGG INITIATED ***\n   🚀   \n  💥 💥 \n👾 👾 👾\nVECTOR RENDERING EMULATION COMPLETED. DEFEND THE SECTOR.");
            return;
        }
        if (cleanVal === 'games') {
            printText("AVAILABLE GAMES:\n- TIC-TAC-TOE\n- CHESS\n- DESERT WARFARE\n- GLOBAL THERMONUCLEAR WAR\n\nType the game name to execute.");
            return;
        }
        if (cleanVal === 'tic-tac-toe' || cleanVal === 'tictactoe') {
            startTTT();
            return;
        }
        
        printText("COMMAND NOT FOUND. TYPE 'games' OR OPERATIONAL KEYWORDS.");
        return;
    }

    // 3. TIC TAC TOE IN-GAME STATE
    if (state === 'TTT') {
        if (cleanVal === 'exit' || cleanVal === 'quit') {
            state = 'COMMAND';
            printText("GAME ABORTED. RETURNING TO WOPR MAIN ENGINE.");
            return;
        }

        let move = parseInt(cleanVal);
        if (isNaN(move) || move < 1 || move > 9 || tttBoard[move - 1] !== '') {
            printText("INVALID SECTOR. ENTER AN EMPTY FIELD (1-9) OR TYPE 'exit'.");
            return;
        }

        // Player Turn
        tttBoard[move - 1] = 'X';
        renderBoard();

        if (checkWin('X')) {
            printText("IMPOSSIBLE ANOMALY: YOU WIN.");
            state = 'COMMAND';
            return;
        }
        if (tttBoard.every(cell => cell !== '')) {
            printText("A STRANGE GAME.\nTHE ONLY WINNING MOVE IS NOT TO PLAY.\n\nRETURNING TO MAIN ROUTER...");
            state = 'COMMAND';
            return;
        }

        // AI Turn (Unbeatable MiniMax Engine)
        printText("WOPR CALCULATING STRATEGIES...");
        let bestMove = getBestMove();
        tttBoard[bestMove] = 'O';
        renderBoard();

        if (checkWin('O')) {
            printText("WOPR WINS. GLOBAL TARGET SECTORS LOCKED.");
            state = 'COMMAND';
            return;
        }
        if (tttBoard.every(cell => cell !== '')) {
            printText("A STRANGE GAME.\nTHE ONLY WINNING MOVE IS NOT TO PLAY.\n\nRETURNING TO MAIN ROUTER...");
            state = 'COMMAND';
            return;
        }
    }
}

// Tic-Tac-Toe Setup and Display logic
function startTTT() {
    state = 'TTT';
    tttBoard = Array(9).fill('');
    printText("INITIALIZING TIC-TAC-TOE GAME MATRIX.\nENTER FIELDS VIA INDEX POSITIONS 1 THROUGH 9:\n  1 | 2 | 3 \n ---|---|---\n  4 | 5 | 6 \n ---|---|---\n  7 | 8 | 9 \n");
}

function renderBoard() {
    let b = tttBoard;
    let displayGrid = `\n  ${b[0]||'1'} | ${b[1]||'2'} | ${b[2]||'3'} \n ---|---|---\n  ${b[3]||'4'} | ${b[4]||'5'} | ${b[5]||'6'} \n ---|---|---\n  ${b[6]||'7'} | ${b[7]||'8'} | ${b[8]||'9'} \n`;
    printText(displayGrid);
}

function checkWin(player) {
    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return wins.some(comb => comb.every(idx => tttBoard[idx] === player));
}

// Unbeatable Tic-Tac-Toe Minimax Algorithm
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'O';
            let score = minimax(tttBoard, 0, false);
            tttBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function closeBrowser() {
    browser.style.display = 'none';
    printText("BROWSER SANDBOX TERMINATED.");
}
