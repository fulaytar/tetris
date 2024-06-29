const tetrisRows = 20;
const tetrisColums = 10;
let playfield;

const tetroMino_Names = ['O', 'L', 'J', 'S', 'Z', 'I', 'T'];

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
};

let tetromino = {
  name: '',
  matrix: [],
  column: 0,
  row: 0,
};

//COMMON
function convertPositionToIndex(row, colum) {
  return row * tetrisColums + colum;
}

function randomFigure(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

//Generete
function genereteTetromino() {
  const nameTetro = randomFigure(tetroMino_Names);
  const matrix = tetroMinoes[nameTetro];

  const columnTetro = Math.floor(tetrisColums / 2 - matrix.length / 2);
  const rowTetro = 5;

  tetromino = {
    name: nameTetro,
    matrix: matrix,
    column: columnTetro,
    row: rowTetro,
  };
}

function gerenetePlayField() {
  for (let i = 0; i < tetrisColums * tetrisRows; i++) {
    const tetrisBlock = document.createElement('li');
    tetrisBlock.className = 'tetris_block';
    /* tetrisBlock.textContent = i; */
    document.querySelector('.tetris').append(tetrisBlock);
  }

  playfield = new Array(tetrisRows)
    .fill()
    .map(() => new Array(tetrisColums).fill(0));
}

//KEYBOARD
document.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
  if (event.key === 'ArrowLeft') {
    moveTetrominoLeft();
  }
  if (event.key === 'ArrowRight') {
    moveTetrominoRight();
  }
  if (event.key === 'ArrowDown') {
    moveTetrominoDown();
  }
  draw();
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    genereteNewTetromino();
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
  drawPlayField();
  allBlockTetris.forEach(el => el.classList.remove(`${tetromino.name}`));
  drawTetramino();
}

// COLLISIONS

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (isOutSideGameboard(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutSideGameboard(row, column) {
  return (
    tetromino.matrix[row][column] &&
    (tetromino.row + row >= tetrisRows ||
      tetromino.column + column < 0 ||
      tetromino.column + column >= tetrisColums)
  );
}

//DRAW
function drawTetramino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
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
    for (let column = 0; column < tetrisColums; column++) {
      if (!playfield[row][column]) continue;
      const nameFidure = tetromino.name;
      const blockIndex = convertPositionToIndex(row, column);

      allBlockTetris[blockIndex].classList.add(nameFidure);
    }
  }
}

function genereteNewTetromino() {
  const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  genereteTetromino();
}

gerenetePlayField();

let allBlockTetris = document.querySelectorAll('.tetris_block');

genereteTetromino();
draw();

/* https://www.youtube.com/watch?v=gl-qRlQIZc4 0:37 */
