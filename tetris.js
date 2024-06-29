const tetrisRows = 10;
const tetrisColums = 20;
let playfield;

const tetroMino_Names = ['0'];

const tetroMinoes = {
  0: [[1]],
};

let tetromino = {
  name: '',
  matrix: '',
  column: 0,
  row: 0,
};

function genereteTetromino() {
  const nameTetro = tetroMino_Names[0];
  const matrix = tetroMinoes[0];
  const columnTetro = 4;
  const rowTetro = 5;

  tetromino = {
    name: nameTetro,
    matrix: matrix,
    column: columnTetro,
    row: rowTetro,
  };
}

function drawPlayField() {
  playfield[4][8] = 'activeBlock';

  for (let row = 0; row < tetrisRows; row++) {
    for (let colum = 0; colum < tetrisColums; colum++) {
      if (!playfield[row][colum]) continue;
      const nameFidure = 'activeBlock';
      const blockIndex = convertPositionToIndex(row, colum);
      allBlockTetris[blockIndex].classList.add(nameFidure);
    }
  }
}
function convertPositionToIndex(row, colum) {
  return row * tetrisColums + colum;
}

function gerenetePlayField() {
  for (let i = 0; i < tetrisRows * tetrisColums; i++) {
    const tetrisBlock = document.createElement('li');
    tetrisBlock.className = 'tetris_block';
    document.querySelector('.tetris').append(tetrisBlock);
  }
  playfield = new Array(tetrisRows)
    .fill()
    .map(() => new Array(tetrisColums).fill(0));
}
gerenetePlayField();

let allBlockTetris = document.querySelectorAll('.tetris_block');

genereteTetromino();

drawPlayField();

/* https://www.youtube.com/live/hGEPkXBKoBM  1^57 */
