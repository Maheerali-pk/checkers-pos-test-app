import fs from "node:fs";
import readline from "node:readline";

type Move = [number, number, number, number];
let game: number[][];

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout,
   terminal: false,
});
rl.setPrompt("Please enter the name of file you want: \n");
rl.prompt();
rl.on("line", (line) => {
   const path = `${__dirname}/files/${line}`;
   if (!fs.existsSync(path)) {
      console.log("Wrong path");
      return;
   }
   const res = evaluateResult(path);
   console.log(res);
});

const fileToMoves = (path: string) => {
   const data = fs.readFileSync(path, "utf8");
   return data.split("\n").map((move) => move.split(",").map(Number) as Move);
};

const evaluateResult = (path: string) => {
   const moves = fileToMoves(path).filter((x) => x.length === 4);
   game = [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
   ];
   for (let i = 0; i < moves.length; i++) {
      let validMove = takeMove(moves[i][0], moves[i][1], moves[i][2], moves[i][3]);
      if (!validMove) {
         return `line ${i + 1} illegal move: ${moves[i].join(",")} `;
      }
   }
   const allCells = game.flat().filter((x) => x !== 0);
   if (allCells.every((piece) => piece === 1)) {
      return "white";
   }
   if (allCells.every((piece) => piece === 2)) {
      return "red";
   }
   return "incomplete game";
};

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

   return true;
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
   // console.log(game, y0, x0);
   let turn = game[y0][x0];
   if (turn === 1) {
      return (
         ((y1 === y0 + 1 && x1 === x0 + 1) ||
            (y1 === y0 + 1 && x1 === x0 - 1) ||
            (y1 === y0 + 2 && x1 === x0 + 2) ||
            (y1 === y0 + 2 && x1 === x0 - 2)) &&
         game[y1][x1] === 0
      );
   }
   if (turn === 2) {
      return (
         ((y1 === y0 - 1 && x1 === x0 + 1) ||
            (y1 === y0 - 1 && x1 === x0 - 1) ||
            (y1 === y0 - 2 && x1 === x0 + 2) ||
            (y1 === y0 - 2 && x1 === x0 - 2)) &&
         game[y1][x1] === 0
      );
   }
   return false;
}
