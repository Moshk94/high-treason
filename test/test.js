// INFO +/- 50 to move along the X axis
// INFO +/- 35 to pickUp
// INFO +/- 40 to move along the y axis

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

let playerTurn = 1;
let allPiece;
let dt = 1 / 60;
let time = 0;
let movementSpeed = 10;
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
    animateMovement() {

        if (this.newX < this.x) {
            this.x -= movementSpeed
        } else if (this.newX > this.x) {

            this.x += movementSpeed
        }
    }
    heal() { };
    buffAttack() { };
};


class Moves extends Piece {
    constructor(p) {
        super();
        this.x = p.x
        this.y = p.y
    };
    draw() {
        let ctxFilterString = `opacity(35%) sepia(100%) saturate(500%) hue-rotate(${50}deg)`;


        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.restore();
    };
    select() { };
};

class Pawn extends Piece {
    constructor(keycode) {
        super();
        this.x = 130 + (50 * 5)
        this.y = 180 + (40 * 5)
        this.currentHP = 1;
        this.maxHP = 100;
        this.attack = 0;
        this.newHP = this.maxHP;
        this.keycode = keycode;
        this.newX = this.x;
    };
    draw(x = this.x, y = this.y, w = 40, h = 60) {
        let ctxFilterString = `sepia(100%) saturate(500%) hue-rotate(${50}deg)`;
        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, x, y, w, h);
        ctx.restore();
        this.animateHP();
        this.animateMovement();
    };
    attackPiece() { };
    findLegalMoves(p) {
        if (p == this.keycode) {
            availableMoves = [];
            let checkEast = playerPieces.some(el => el.position === this.x - 50);
            let checkWest = playerPieces.some(el => el.position === this.x + 50);
            let checkNorth =  playerPieces.some(el => el.position === this.x - 50);
            let checkSouth =  playerPieces.some(el => el.position === this.x + 50);

            if (this.x - 50 > 130 && !checkEast) {
                availableMoves.push(new Moves({ x: this.x - 50, y: this.y }))
            }
            if (this.x + 50 < 480 && !checkWest) {
                availableMoves.push(new Moves({ x: this.x + 50, y: this.y }))
            }

            if(this.y - 40 > 180 && !checkNorth){
                availableMoves.push(new Moves({ x: this.x, y: this.y - 40 }))
            }

            if(this.y + 40 < 460 && !checkSouth){
                availableMoves.push(new Moves({ x: this.x, y: this.y + 40 }))
            }
        };
    };
};

let availableMoves = [];
export let playerPieces = [
    new Pawn(49)
];

canvas.addEventListener('keydown', function (e) {
    console.log(e.keyCode);
    playerPieces.forEach(p => {
        p.findLegalMoves(e.keyCode);
    });
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
    drawInformationSection();
    drawBoard();
    allPiece = [...availableMoves, ...playerPieces].sort(function (a, b) { return a.y - b.y });

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
    };
};