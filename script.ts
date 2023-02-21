const board = document.querySelector("#board") as HTMLElement;
const next = document.querySelector("#next") as HTMLButtonElement;
const game = [
   [0, 1, 0, 1, 0, 1, 0, 1],
   [1, 0, 1, 0, 1, 0, 1, 0],
   [0, 1, 0, 1, 0, 1, 0, 1],
   [0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0],
   [2, 0, 2, 0, 2, 0, 2, 0],
   [0, 2, 0, 2, 0, 2, 0, 2],
   [2, 0, 2, 0, 2, 0, 2, 0],
];
const cells: HTMLElement[][] = [];
let allMoves: [number, number, number, number][] = [];

window.addEventListener("load", () => {
   for (let i = 0; i < 8; i++) {
      cells.push([]);
      for (let j = 0; j < 8; j++) {
         const cell = document.createElement("div");
         cell.classList.add("cell");
         cell.classList.add((i % 2 !== 0 && j % 2 === 0) || (i % 2 === 0 && j % 2 !== 0) ? "dark" : "light");
         board.appendChild(cell);
         cells[cells.length - 1].push(cell);
      }
   }
   renderGame();
});

function renderGame() {
   for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
         const val = game[i][j];
         const cell = cells[i][j];
         cell.classList.remove("white");
         cell.classList.remove("red");
         if (val === 1) {
            cell.classList.add("white");
         }
         if (val === 2) {
            cell.classList.add("red");
         }
      }
   }
}

function getPlayerPoints(turn: number) {
   const res: { x: number; y: number }[] = [];
   game.forEach((row, i) => {
      row.forEach((x, j) => {
         if (x === turn) {
            res.push({ y: i, x: j });
         }
      });
   });
   return res;
}

function canPieceJump(y: number, x: number) {
   let turn = game[y][x];
   if (turn === 1) {
      return (
         (game[y + 1]?.[x + 1] === 2 && game[y + 2]?.[x + 2] === 0) ||
         (game[y + 1]?.[x - 1] === 2 && game[y + 2]?.[x - 2] === 0)
      );
   }
   if (turn === 2) {
      return (
         (game[y - 1]?.[x + 1] === 1 && game[y - 2]?.[x + 2] === 0) ||
         (game[y - 1]?.[x - 1] === 1 && game[y - 2]?.[x - 2] === 0)
      );
   }
   return false;
}

function isValidMove(y0: number, x0: number, y1: number, x1: number) {
   let turn = game[y0][x0];
   if (turn === 1) {
      return (
         (y1 === y0 + 1 && x1 === x0 + 1) ||
         (y1 === y0 + 1 && x1 === x0 - 1) ||
         (y1 === y0 + 2 && x1 === x0 + 2) ||
         (y1 === y0 + 2 && x1 === x0 - 2)
      );
   }
   if (turn === 2) {
      return (
         (y1 === y0 - 1 && x1 === x0 + 1) ||
         (y1 === y0 - 1 && x1 === x0 - 1) ||
         (y1 === y0 - 2 && x1 === x0 + 2) ||
         (y1 === y0 - 2 && x1 === x0 - 2)
      );
   }
   return false;
}

function takeMove(x0: number, y0: number, x1: number, y1: number) {
   let rowDiff = Math.abs(y0 - y1);
   let turn = game[y0][x0];

   const points = getPlayerPoints(turn);
   const canJump = points.some(({ x, y }) => canPieceJump(y, x));
   if (canJump && rowDiff < 2) {
      return false;
   }
   if (!isValidMove(y0, x0, y1, x1)) {
      return false;
   }
   if (rowDiff > 1) {
      const colChange = x1 - x0;
      const jy = game[y0][x0] === 1 ? y0 + 1 : y0 - 1;
      const jx = x0 + colChange / 2;
      game[jy][jx] = 0;
   }
   game[y1][x1] = game[y0][x0];
   game[y0][x0] = 0;

   renderGame();
   return true;
}

async function playGame(game: string) {
   const moves = game.split("\n");

   for (let i = 0; i < moves.length; i++) {
      allMoves.unshift(moves[i].split(",").map(Number) as [number, number, number, number]);
   }
}
next.addEventListener("click", (e) => {
   const move = allMoves.pop() as [number, number, number, number];
   const res = takeMove(...move);
   if (!res) {
      alert("error");
   }
});

const getResultOfGame = (game: string) => {
   const moves = game.split("\n");
};

const games = [
   `1,2,2,3
6,5,7,4
3,2,4,3
2,5,1,4
2,1,3,2
5,6,6,5
4,3,5,4
6,5,4,3
4,3,2,1
1,0,3,2
7,6,6,5
0,1,1,2
4,5,5,4
7,2,6,3
5,4,7,2
5,2,4,3
6,7,7,6
2,3,3,4
4,7,5,6
3,0,2,1
3,6,2,5
1,2,2,3
2,7,3,6
2,1,1,2
1,4,0,3
2,3,1,4
0,3,2,1
3,2,2,3
2,5,0,3
4,1,3,2
3,6,4,5
2,3,1,4
4,5,2,3
2,3,4,1
5,0,3,2
0,5,2,3
2,3,4,1
6,1,5,2
2,1,1,0
4,3,3,4
0,3,1,2
5,2,4,3
1,2,0,1
3,4,4,5
5,6,3,4
3,4,5,2
7,0,6,1
7,2,5,0`,
];

playGame(games[0]);
