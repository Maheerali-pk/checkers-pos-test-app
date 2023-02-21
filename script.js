"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const board = document.querySelector("#board");
const next = document.querySelector("#next");
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
const cells = [];
let allMoves = [];
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
function getPlayerPoints(turn) {
    const res = [];
    game.forEach((row, i) => {
        row.forEach((x, j) => {
            if (x === turn) {
                res.push({ y: i, x: j });
            }
        });
    });
    return res;
}
function canPieceJump(y, x) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let turn = game[y][x];
    if (turn === 1) {
        return ((((_a = game[y + 1]) === null || _a === void 0 ? void 0 : _a[x + 1]) === 2 && ((_b = game[y + 2]) === null || _b === void 0 ? void 0 : _b[x + 2]) === 0) ||
            (((_c = game[y + 1]) === null || _c === void 0 ? void 0 : _c[x - 1]) === 2 && ((_d = game[y + 2]) === null || _d === void 0 ? void 0 : _d[x - 2]) === 0));
    }
    if (turn === 2) {
        return ((((_e = game[y - 1]) === null || _e === void 0 ? void 0 : _e[x + 1]) === 1 && ((_f = game[y - 2]) === null || _f === void 0 ? void 0 : _f[x + 2]) === 0) ||
            (((_g = game[y - 1]) === null || _g === void 0 ? void 0 : _g[x - 1]) === 1 && ((_h = game[y - 2]) === null || _h === void 0 ? void 0 : _h[x - 2]) === 0));
    }
    return false;
}
function isValidMove(y0, x0, y1, x1) {
    let turn = game[y0][x0];
    if (turn === 1) {
        return ((y1 === y0 + 1 && x1 === x0 + 1) ||
            (y1 === y0 + 1 && x1 === x0 - 1) ||
            (y1 === y0 + 2 && x1 === x0 + 2) ||
            (y1 === y0 + 2 && x1 === x0 - 2));
    }
    if (turn === 2) {
        return ((y1 === y0 - 1 && x1 === x0 + 1) ||
            (y1 === y0 - 1 && x1 === x0 - 1) ||
            (y1 === y0 - 2 && x1 === x0 + 2) ||
            (y1 === y0 - 2 && x1 === x0 - 2));
    }
    return false;
}
function takeMove(x0, y0, x1, y1) {
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
function playGame(game) {
    return __awaiter(this, void 0, void 0, function* () {
        const moves = game.split("\n");
        for (let i = 0; i < moves.length; i++) {
            allMoves.unshift(moves[i].split(",").map(Number));
        }
    });
}
next.addEventListener("click", (e) => {
    const move = allMoves.pop();
    const res = takeMove(...move);
    if (!res) {
        alert("error");
    }
});
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
