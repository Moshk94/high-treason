// INFO +/- 50 to move along the X axis
// INFO +/- 35 to move along the y axis

import { drawDebuggerGrid, drawText, drawBoard, drawInformationSection } from "./debugTools";

export const ctx = document.getElementById('canvas').getContext("2d");
export const boardX = 125;
export const boardY = 200;
export const cellSize = 50;

export const PI = Math.PI;

const pawnImg = new Image();
const queenImg = new Image();
queenImg.src = 'q.png'
pawnImg.src = 'p.png';

let allPiece;
let dt = 1 / 60;
let time = 0;

class Piece {
    animateHP(s = 1) {
        if (this.newHP > this.currentHP && this.newHP <= this.maxHP) {
            this.currentHP += s
        } else if (this.newHP < this.currentHP && this.newHP >= 0) {
            this.currentHP -= s
        }

        this.currentHP <= 0 ? this.currentHP = 0 : 0;
        this.currentHP >= this.maxHP ? this.currentHP = this.maxHP : 0;

        this.newHP <= 0 ? this.newHP = 0 : 0;
        this.newHP >= this.maxHP ? this.newHP = this.maxHP : 0;
    };

    heal() {};
    buffAttack() {};
};


class Moves extends Piece {
    constructor(position, owner, keycode) {
        super();
        this.owner = owner;
        this.keycode = keycode
    };
    draw() {
        let ctxFilterString = `opacity(35%) sepia(100%) saturate(500%) hue-rotate(${50}deg)`;

        this.x = 130 + (this.getBoardCoords(this.position).x * 50);
        this.y = 180 + (50 * 0.8 * this.getBoardCoords(this.position).y);

        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.restore();
    };
    select() {};
};

class Pawn extends Piece {
    constructor() {
        super();
        this.x = 130
        this.y = 180 + 35
        this.currentHP = 1;
        this.maxHP = 100;
        this.attack = 0;
        this.newHP = this.maxHP;
    };
    draw(x = this.x, y = this.y, w = 40, h = 60) {
        let ctxFilterString = `sepia(100%) saturate(500%) hue-rotate(${50}deg)`;

        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, x, y, w, h);
        ctx.restore();
        this.animateHP();
    };
    attackPiece() {};
    findLegalMoves() {};
};

let ghostArray = [];
export let pawnArray = [
    new Pawn()
];

canvas.addEventListener('keydown', function (e) {
    console.log(e.keyCode);
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
    drawInformationSection();
    drawBoard();
    allPiece = [...ghostArray, ...pawnArray]

    // allPiece = [...ghostArray, ...pawnArray].sort(function (a, b) { return a.position - b.position });

    allPiece.forEach(e => {
        e.draw()
    });

    timingFunction();
}, 1 / 60);

function timingFunction() {
    dt++
    if (dt > 30) {
        time += 0.5;
        dt = 0;
    }
};