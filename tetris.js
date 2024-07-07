const tetrisRows = 20;
const tetrisColumns = 10;
let playfield;
let allBlockTetris;
let isPaused = false;
let timerID;
let isGameOver = false;
const overlay = document.querySelector('.overlay');
const btn_restart = document.querySelector('.result_restart_game');
const pauseOverlay = document.querySelector('.pause_overlay');
const currentScore = document.querySelector('#current_count');
const currentLvl = document.querySelector('#current_lvl');
const pauseGame = document.querySelector('#pause_game');
const pause_active = document.querySelector('.pause_active');
const result_end_game = document.querySelector('.result_end_game');
const max_score = document.querySelector('.max_score');
const current_lvl = document.querySelector('#current_lvl');
let addSpeed = 0;
let score = 0;
const lastMaxResult = parseInt(localStorage.getItem('max-result')) || 0;

pauseGame.addEventListener('click', togglePaused);
pause_active.addEventListener('click', togglePaused);

const tetroMino_Names = ['O', 'L', 'J', 'S', 'Z', 'I', 'T', 'B'];

const tetroMinoes = {
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  B: [[1]],
};

let tetromino = {
  name: '',
  matrix: [],
  column: 0,
  row: 0,
};

//========Safari zoom=====
document.addEventListener(
  'touchmove',
  function (event) {
    event = event.originalEvent || event;
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  false
);
//===========COMMON==================
function init() {
  score = 0;
  result_end_game.innerHTML = 0;
  currentScore.innerHTML = 0;
  isGameOver = false;
  generatePlayField();
  allBlockTetris = document.querySelectorAll('.tetris li');
  generateTetromino();
  startLoop();
  /* draw(); */
}

function updateLastMaxResult() {
  const lastMaxResult = parseInt(localStorage.getItem('max-result')) || 0;
  if (lastMaxResult >= score) {
    max_score.innerHTML = lastMaxResult;
  } else {
    max_score.innerHTML = score;
    localStorage.setItem('max-result', score);
  }
}

function convertPositionToIndex(row, column) {
  return row * tetrisColumns + column;
}

function randomFigure(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

btn_restart.addEventListener('click', () => {
  document.querySelector('.tetris').innerHTML = '';
  overlay.classList.add('visually-hidden');

  init();
});

//===========Generete==========
function generateTetromino() {
  const nameTetro = randomFigure(tetroMino_Names);
  const matrix = tetroMinoes[nameTetro];

  const columnTetro = Math.floor(tetrisColumns / 2 - matrix.length / 2);
  const rowTetro = -2;

  tetromino = {
    name: nameTetro,
    matrix: matrix,
    column: columnTetro,
    row: rowTetro,
  };
}

function generatePlayField() {
  for (let i = 0; i < tetrisColumns * tetrisRows; i++) {
    const tetrisBlock = document.createElement('li');
    document.querySelector('.tetris').append(tetrisBlock);
  }

  playfield = new Array(tetrisRows)
    .fill()
    .map(() => new Array(tetrisColumns).fill(0));
}

//===========KEYBOARD==========
document.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
  if (event.key === 'Escape') {
    togglePaused();
  }
  if (!isPaused) {
    if (event.key === ' ') {
      event.preventDefault();
      dropTetrominoDown();
    }
    if (event.key === 'ArrowUp') {
      rotate();
    }
    if (event.key === 'ArrowLeft') {
      moveTetrominoLeft();
    }
    if (event.key === 'ArrowRight') {
      moveTetrominoRight();
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveTetrominoDown();
    }
  }
  draw();
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (!isValid()) {
    tetromino.column -= 1;
  }
}

function draw() {
  allBlockTetris.forEach(el => el.removeAttribute('class'));
  drawPlayField();
  drawTetromino();
}

function dropTetrominoDown() {
  while (isValid()) {
    tetromino.row++;
  }
  tetromino.row--;
}

function togglePaused() {
  if (isPaused || isGameOver) {
    pauseOverlay.style.display = 'none';
    startLoop();
  } else {
    pauseOverlay.style.display = 'flex';
    stopLoop();
  }

  isPaused = !isPaused;
}

// =========COLLISIONS==========
function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (isOutsideOfGameboard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutsideOfTopGameBoard(row) {
  return tetromino.row + row < 0;
}

function isOutsideOfGameboard(row, column) {
  return (
    tetromino.matrix[row][column] &&
    (tetromino.row + row >= tetrisRows ||
      tetromino.column + column < 0 ||
      tetromino.column + column >= tetrisColumns)
  );
}

function hasCollisions(row, column) {
  return (
    tetromino.matrix[row][column] &&
    playfield[tetromino.row + row]?.[tetromino.column + column]
  );
}

//===========ROTATE========
function rotate() {
  rotateTetromino();
  draw();
}

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(oldMatrix);
  tetromino.matrix = rotatedMatrix;
  if (!isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

//===========DRAW=========
function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (isOutsideOfTopGameBoard(row)) {
        continue;
      }
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      const index = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );

      allBlockTetris[index].classList.add(name);
    }
  }
}

function drawPlayField() {
  for (let row = 0; row < tetrisRows; row++) {
    for (let column = 0; column < tetrisColumns; column++) {
      if (!playfield[row][column]) continue;
      const nameFigure = playfield[row][column];
      const blockIndex = convertPositionToIndex(row, column);

      allBlockTetris[blockIndex].classList.add(nameFigure);
    }
  }
}
function countScore(destroyRows) {
  if (destroyRows === 0) {
    return;
  }
  if (score >= 450) {
    addSpeed = 450; //100мс
    current_lvl.innerHTML = 'max'; // Установка максимальної швидкості
  } else if (score >= 400 && score < 450) {
    addSpeed = 400; //150мс
    current_lvl.innerHTML = 9; // Установка рівня 9
  } else if (score >= 350 && score < 400) {
    addSpeed = 350; //200мс
    current_lvl.innerHTML = 8; // Установка рівня 8
  } else if (score >= 300 && score < 350) {
    addSpeed = 300;
    current_lvl.innerHTML = 7; // Установка рівня 7
  } else if (score >= 250 && score < 300) {
    addSpeed = 250;
    current_lvl.innerHTML = 6; // Установка рівня 6
  } else if (score >= 200 && score < 250) {
    addSpeed = 200;
    current_lvl.innerHTML = 5; // Установка рівня 5
  } else if (score >= 150 && score < 200) {
    addSpeed = 150;
    current_lvl.innerHTML = 4; // Установка рівня 4
  } else if (score >= 100 && score < 150) {
    addSpeed = 100;
    current_lvl.innerHTML = 3; // Установка рівня 3
  } else if (score >= 50 && score < 100) {
    addSpeed = 50;
    current_lvl.innerHTML = 2; // Установка рівня 2
  }

  score += 10 * destroyRows;
  currentScore.innerHTML = score;
  updateLastMaxResult(); // Оновлення lastMaxResult при зміні score
  result_end_game.innerHTML = score;
}

function placeTetromino() {
  const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (isOutsideOfTopGameBoard(row)) {
        updateLastMaxResult(); // Оновлення lastMaxResult при зміні score
        isGameOver = true;
        overlay.classList.remove('visually-hidden');
        return;
      }
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  let filledRows = findFilledRows();
  //console.log(filledRows);
  removeFillRow(filledRows);

  countScore(filledRows.length);
  generateTetromino();
}

function findFilledRows() {
  const fillRows = [];

  for (let row = 0; row < tetrisRows; row++) {
    let filledColumns = 0;
    for (let column = 0; column < tetrisColumns; column++) {
      if (playfield[row][column] !== 0) {
        filledColumns++;
      }
    }
    if (tetrisColumns === filledColumns) {
      fillRows.push(row);
    }
  }
  return fillRows;
}

function removeFillRow(filledRow) {
  for (let i = 0; i < filledRow.length; i++) {
    const row = filledRow[i];
    dropRowsAbove(row);
  }
}

function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    playfield[row] = playfield[row - 1];
  }
  playfield[0] = new Array(tetrisColumns).fill(0);
}

function moveDown() {
  moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();
}

function startLoop() {
  timerID = setTimeout(() => requestAnimationFrame(moveDown), 550 - addSpeed);
}

function stopLoop() {
  clearTimeout(timerID);

  timerID = null;
}

init();
