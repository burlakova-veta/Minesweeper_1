console.clear();

let size = 15;
let bombFrequency = 0.2;
let tileSize = 30;

const board = document.querySelector('.board');
let tiles;
let boardSize;
const restartBtn = document.querySelector('.btn');
const end = document.querySelector('.end');

let bombs = [];
let numbers = [];
let numberColors = ['#0000ff', '#008000', '#ff0000', '#000080', '#964b00', '#30d5c8', '#000000', '#ffffff',];
let endContent = { win: 'Game over. You win!', loose: 'Game over. You lose' };

let gameOver = false;

const setup = () => {
    for (let i = 0; i < Math.pow(size, 2); i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        board.appendChild(tile);
    }
    tiles = document.querySelectorAll('.tile');
    boardSize = Math.sqrt(tiles.length);
    board.style.width = boardSize * tileSize + 'px';

    document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
    document.documentElement.style.setProperty('--boardSize', `${boardSize * tileSize}px`);

    let x = 0;
    let y = 0;
    tiles.forEach((tile, i) => {
        tile.setAttribute('data-tile', `${x},${y}`);
        let random_boolean = Math.random() < bombFrequency;
        if (random_boolean) {
            bombs.push(`${x},${y}`);
            if (x > 0) numbers.push(`${x - 1},${y}`);
            if (x < boardSize - 1) numbers.push(`${x + 1},${y}`);
            if (y > 0) numbers.push(`${x},${y - 1}`);
            if (y < boardSize - 1) numbers.push(`${x},${y + 1}`);

            if (x > 0 && y > 0) numbers.push(`${x - 1},${y - 1}`);
            if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x + 1},${y + 1}`);

            if (y > 0 && x < boardSize - 1) numbers.push(`${x + 1},${y - 1}`);
            if (x > 0 && y < boardSize - 1) numbers.push(`${x - 1},${y + 1}`);
        }
        x++;
        if (x >= boardSize) {
            x = 0;
            y++;
        }
        tile.oncontextmenu = function (e) {
            e.preventDefault();
            flag(tile);
        }
        tile.addEventListener('click', function (e) {
            clickTile(tile);
        });
    });

    numbers.forEach(num => {
        let coords = num.split(',');
        let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
        let dataNum = parseInt(tile.getAttribute('data-num'));
        if (!dataNum) dataNum = 0;
        tile.setAttribute('data-num', dataNum + 1);
    });
}

const flag = (tile) => {
    if (gameOver) return;
    if (!tile.classList.contains('tile--checked')) {
        if (!tile.classList.contains('tile--flagged')) {
            tile.innerHTML = '🚩';
            tile.classList.add('tile--flagged');
        } else {
            tile.innerHTML = '';
            tile.classList.remove('tile--flagged');
        }
    }
}

const clickTile = (tile) => {
    if (gameOver) return;
    if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return;
    let coordinate = tile.getAttribute('data-tile');
    if (bombs.includes(coordinate)) {
        endGame(tile);
    } else {
        let num = tile.getAttribute('data-num');
        if (num != null) {
            tile.classList.add('tile--checked');
            tile.innerHTML = num;
            tile.style.color = numberColors[num - 1];
            setTimeout(() => {
                checkVictory();
            }, 100);
            return;
        }
        checkTile(tile, coordinate);
    }
    tile.classList.add('tile--checked');
}

const checkTile = (tile, coordinate) => {
    let coords = coordinate.split(',');
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    setTimeout(() => {
        if (x > 0) {
            let targetW = document.querySelectorAll(`[data-tile="${x - 1},${y}"`)[0];
            clickTile(targetW, `${x - 1},${y}`);
        }
        if (x < boardSize - 1) {
            let targetE = document.querySelectorAll(`[data-tile="${x + 1},${y}"`)[0];
            clickTile(targetE, `${x + 1},${y}`);
        }
        if (y > 0) {
            let targetN = document.querySelectorAll(`[data-tile="${x},${y - 1}"]`)[0];
            clickTile(targetN, `${x},${y - 1}`);
        }
        if (y < boardSize - 1) {
            let targetS = document.querySelectorAll(`[data-tile="${x},${y + 1}"]`)[0];
            clickTile(targetS, `${x},${y + 1}`);
        }

        if (x > 0 && y > 0) {
            let targetNW = document.querySelectorAll(`[data-tile="${x - 1},${y - 1}"`)[0];
            clickTile(targetNW, `${x - 1},${y - 1}`);
        }
        if (x < boardSize - 1 && y < boardSize - 1) {
            let targetSE = document.querySelectorAll(`[data-tile="${x + 1},${y + 1}"`)[0];
            clickTile(targetSE, `${x + 1},${y + 1}`);
        }

        if (y > 0 && x < boardSize - 1) {
            let targetNE = document.querySelectorAll(`[data-tile="${x + 1},${y - 1}"]`)[0];
            clickTile(targetNE, `${x + 1},${y - 1}`);
        }
        if (x > 0 && y < boardSize - 1) {
            let targetSW = document.querySelectorAll(`[data-tile="${x - 1},${y + 1}"`)[0];
            clickTile(targetSW, `${x - 1},${y + 1}`);
        }
    }, 10);
}

const endGame = (tile) => {
    end.innerHTML = endContent.loose;
    end.classList.add('show');
    gameOver = true;
    tiles.forEach(tile => {
        let coordinate = tile.getAttribute('data-tile');
        if (bombs.includes(coordinate)) {
            tile.classList.remove('tile--flagged');
            tile.classList.add('tile--checked', 'tile--bomb');
            tile.innerHTML = '💣';
        }
    });
}

const checkVictory = () => {
    let win = true;
    tiles.forEach(tile => {
        let coordinate = tile.getAttribute('data-tile');
        if (!tile.classList.contains('tile--checked') && !bombs.includes(coordinate)) win = false;
    });
    if (win) {
        end.innerHTML = endContent.win;
        end.classList.add('show');
        gameOver = true;
    }
}

setup();

restartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    clear();
});

const clear = () => {
    gameOver = false;
    bombs = [];
    numbers = [];
    end.innerHTML = '';
    end.classList.remove('show');
    tiles.forEach(tile => {
        tile.remove();
    });
    setup();
}