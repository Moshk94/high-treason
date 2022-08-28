// INFO +/- 50 to move along the X axis
// INFO +/- 35 to pickUp
// INFO +/- 40 to move along the y axis

import { drawDebuggerGrid, drawText, drawBoard, drawInformationSection } from "./debugTools";
import pawnSrc from "../src/p.png"


export const ctx = document.getElementById('canvas').getContext("2d");
export const boardX = 125;
export const boardY = 200;
export const cellSize = 50;

export const PI = Math.PI;

const pawnImg = new Image();
const queenImg = new Image();
const heartImg = new Image();
export const swordImg = new Image();

heartImg.src = 'h.png'
queenImg.src = 'q.png'
pawnImg.src = pawnSrc;
swordImg.src = 's.png';
let infoTextLocation = [];
let playSpecial = 0;

let diagonals = [
    { x: 50, y: -40 }, // NE
    { x: 50, y: 40 }, // SE
    { x: -50, y: 40 }, // SW
    { x: -50, y: -40 } // SE
]
let playerTurn = 1;
let allPiece;
let dt = 1 / 60;
let time = 0;
let movementSpeed = 5;
class Piece {
    animateHP(s = 1) {
        if (this.newHP > this.currentHP && this.newHP <= this.maxHP) {
            this.currentHP += s;
        } else if (this.newHP < this.currentHP && this.newHP >= 0) {
            this.currentHP -= s;
        };

        this.currentHP <= 0 ? this.currentHP = 0 : 0;
        this.currentHP >= this.maxHP ? this.currentHP = this.maxHP : 0;

        this.newHP <= 0 ? this.newHP = 0 : 0;
        this.newHP >= this.maxHP ? this.newHP = this.maxHP : 0;
    };
    animateMovement() {
        if (this.tempY == undefined) {
            this.newX < this.x ? this.x -= movementSpeed : 0;
            this.newX > this.x ? this.x += movementSpeed : 0;
            this.newY > this.y ? this.y += movementSpeed : 0;
            this.newY < this.y ? this.y -= movementSpeed : 0;
            if (this.newY - 5 == this.y && infoTextLocation.length != 0) {
                playSpecial = 1;
            }
        } else {
            this.tempY < this.y ? this.y -= movementSpeed / 2 : 0;
            if (this.tempY == this.y) {
                this.tempY = undefined;
            };
        };
    };
    animateSpecial() {
        this.tempY = this.y - 35
    };
    heal() {
        let healValue;
        if (this.constructor.name == "Queen") {
            healValue = 35;
            infoTextLocation.push({ x: this.x, y: this.y, v: healValue, o: this.y, t: 'h' })
        } else {
            let piecesToHeal = [];
            diagonals = [{ x: 50, y: -40 }, { x: 50, y: 40 }, { x: -50, y: 40 }, { x: -50, y: -40 }]

            healValue = 20;
            diagonals.forEach(d => {
                d.x += this.x
                d.y += this.y

                let c = playerPieces.findIndex(a => a.x === d.x && a.y === d.y && a.currentHP != a.maxHP)
                if (c >= 0) {
                    piecesToHeal.push(c);
                    healValue /= 2;
                }
            });

            piecesToHeal.forEach(i => {
                playerPieces[i].newHP += healValue;
                infoTextLocation.push({ x: playerPieces[i].x, y: playerPieces[i].y, v: healValue, o: playerPieces[i].y, t: 'h' })
            });
        };
        infoTextLocation.push({ x: this.x, y: this.y, v: healValue, o: this.y, t: 'h' })
        this.newHP += healValue;
        this.animateSpecial();
    }
    buffAttack() {
        let attackBuffValue = 10;
        if (this.constructor.name == "Pawn") {
            attackBuffValue /= 2
            diagonals = [{ x: 50, y: -40 }, { x: 50, y: 40 }, { x: -50, y: 40 }, { x: -50, y: -40 }];

            diagonals.forEach(d => {

                d.x += this.x;
                d.y += this.y;

                let c = playerPieces.findIndex(a => a.x === d.x && a.y === d.y);
                if (c >= 0) {
                    playerPieces[c].attack += 10;
                    infoTextLocation.push({ x: playerPieces[c].x, y: playerPieces[c].y, v: attackBuffValue * 2, o: playerPieces[c].y, t: 'a' })
                };
            });
        };

        infoTextLocation.push({ x: this.x, y: this.y, v: attackBuffValue, o: this.y, t: 'a' })
        this.attack += attackBuffValue;
        this.animateSpecial();

    };
    attackAnimation(x, y) {
        this.x -= ((this.x - x) / 2);
        this.y -= ((this.y - y) / 2);
    };
    updateScore() {
        if(this.currentHP > 0){
            this.score = this.currentHP + this.attack;
        } else {
            this.score = 0;
        }
    }
};

class Moves extends Piece {
    constructor(p) {
        super();
        this.x = p.x
        this.y = p.y
        this.owner = p.o
        this.direction = p.d
        this.key = p.k
    };
    draw() {
        let deg;
        this.key == 1 ? deg = 65 : 0;
        this.key == 2 ? deg = -60 : 0;
        this.key == 3 ? deg = 180 : 0;
        let ctxFilterString = `opacity(35%) sepia(100%) saturate(500%) hue-rotate(${deg}deg)`;
        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.restore();
    };
};

class Pawn extends Piece {
    constructor(keycode, x, y) {
        super();
        this.x = 130 + (50 * x)
        this.y = 180 + (40 * y)
        this.currentHP = 1;
        this.maxHP = 100;
        this.attack = keycode == 3 ? 20 : 10;
        this.newHP = this.maxHP;
        this.key = keycode;
        this.newX = this.x;
        this.newY = this.y;
        this.ctxFilterString;
    };
    draw(x = this.x, y = this.y, w = 40, h = 60) {
        let deg;

        this.key == 1 ? deg = 65 : 0;
        this.key == 2 ? deg = -60 : 0;
        this.key == 3 ? deg = 180 : 0;

        this.ctxFilterString = `sepia(100%) saturate(500%) hue-rotate(${deg}deg)`;
        ctx.save();
        ctx.filter = this.ctxFilterString;
        ctx.drawImage(pawnImg, x, y, w, h);
        ctx.restore();
        this.animateHP();
        this.animateMovement();
        this.updateScore();
    };
    attackQueen() {
        diagonals = [{ x: 50, y: -40 }, { x: 50, y: 40 }, { x: -50, y: 40 }, { x: -50, y: -40 }];
        diagonals.every(d => {
            d.x += this.x;
            d.y += this.y;
            if (queenPiece.x == d.x && queenPiece.y == d.y) {
                this.attackAnimation(queenPiece.x, queenPiece.y);
                queenPiece.newHP -= this.attack
                infoTextLocation.push({ x: queenPiece.x, y: queenPiece.y, v: (-this.attack), o: queenPiece.y, t: 'h' });
                playSpecial = 1
                return false;
            } else { return true };
        });
        this.selected = 0
    };
    findLegalMoves(p) {
        if (p == this.key) {
            playerPieces.forEach(p => { p.selected = 0 })
            availableMoves = [];
            this.selected = 1;
            let checkEast = playerPieces.some(el => el.x === this.x + 50 && this.y === el.y) || queenPiece.y === this.y && this.x + 50 === queenPiece.x;;
            let checkWest = playerPieces.some(el => el.x === this.x - 50 && this.y === el.y) || queenPiece.y === this.y && this.x - 50 === queenPiece.x;
            let checkNorth = playerPieces.some(el => el.y === this.y - 40 && this.x === el.x) || queenPiece.y === this.y - 40 && this.x === queenPiece.x;
            let checkSouth = playerPieces.some(el => el.y === this.y + 40 && this.x === el.x) || queenPiece.y === this.y + 40 && this.x === queenPiece.x;;

            if (this.x - 50 >= 130 && !checkWest) {
                availableMoves.push(new Moves({ k: this.key, x: this.x - 50, y: this.y, d: 'ArrowLeft' }))
            }
            if (this.x + 50 < 480 && !checkEast) {
                availableMoves.push(new Moves({ k: this.key, x: this.x + 50, y: this.y, d: 'ArrowRight' }))
            }

            if (this.y - 40 >= 180 && !checkNorth) {
                availableMoves.push(new Moves({ k: this.key, x: this.x, y: this.y - 40, d: 'ArrowUp' }))
            }

            if (this.y + 40 < 460 && !checkSouth) {
                availableMoves.push(new Moves({ k: this.key, x: this.x, y: this.y + 40, d: 'ArrowDown' }))
            }
        };
    };
};

class Queen extends Piece {
    constructor() {
        super();
        this.x = 280
        this.y = 180
        this.currentHP = 20;
        this.maxHP = 300;
        this.attack = 30;
        this.newHP = 20 //this.maxHP
    };
    draw() {
        ctx.save();
        ctx.filter = 'brightness(50%)';
        ctx.drawImage(queenImg, this.x - 5, this.y - 20);
        ctx.restore();
        this.drawQueenInformationSection();
        this.animateHP(5);
        this.updateScore();

    }
    drawQueenInformationSection() {
        ctx.fillStyle = "black";
        ctx.fillRect(boardX, boardY - cellSize * 2, 350, 50);

        ctx.fillStyle = "grey"
        ctx.fillRect(boardX, boardY - cellSize * 2, 350, 20);

        ctx.fillStyle = "darkgreen"
        ctx.fillRect(boardX, boardY - cellSize * 2, 350 * (this.currentHP / this.maxHP), 20);

        drawText(`${this.currentHP} / ${this.maxHP}`, boardX + 175, boardY - cellSize * 2 + 9, 25, 'white');

        drawText(`Att: ${this.attack}`, boardX + 175, boardY - cellSize * 2 + 35, 25, 'white');

        ctx.beginPath();
        ctx.strokeStyle = 'darkred';
        ctx.lineWidth = 5;
        ctx.arc(boardX, boardY - cellSize * 2 + 25, 30, 0, 2 * PI);
        ctx.stroke();
        ctx.fillStyle = "black"
        ctx.fill();

        ctx.save();
        ctx.filter = 'brightness(50%)';
        ctx.drawImage(queenImg, boardX - 25, boardY - 130);
        ctx.restore();
    };
    findLegalMoves() {
        let legalMoves = []
        let sq = [
            { x: 0, y: 40 }, // South
            { x: 0, y: -40 }, // Nouth
            { x: 50, y: -40 }, // NE
            { x: -50, y: -40 }, // NW
            { x: -50, y: 40 },// SW
            { x: -50, y: 0 },// W
            { x: 50, y: 0 },// E
            { x: 50, y: 40 }, // SE
        ];

        for (let i = 0; i < sq.length; i++) {
            if (this.x + sq[i].x >= 130 &&
                this.x + sq[i].x < 480 &&
                this.y + sq[i].y >= 180 &&
                this.y + sq[i].y < 460) {
                legalMoves.push(sq[i])
            }
        };
        console.log(allPiece)
    };
};

let queenPiece = new Queen();
let availableMoves = [];
export let playerPieces = [
    new Pawn(1, 3, 2),
    // new Pawn(2, 4, 1),
    // new Pawn(3, 2, 1),
];

canvas.addEventListener('keydown', function (e) {
    // console.log(`${e.keyCode}: ${e.key}`);
    if (e.key == ' ') {
        queenPiece.findLegalMoves();
    }
    playerPieces.forEach(p => {
        if (p.selected) {
            let findD = availableMoves.findIndex(ee => ee.direction == e.key);
            if (findD >= 0) {
                if (e.key == 'ArrowUp') {
                    p.newY -= 40;
                }
                if (e.key == 'ArrowLeft') {
                    p.newX -= 50;
                }
                if (e.key == 'ArrowRight') {
                    p.newX += 50;
                }
                if (e.key == 'ArrowDown') {
                    p.newY += 40;
                }
                p.selected = 0;
            }
            if (e.key == 'x' && playerPieces[0].selected) {
                playerPieces[0].heal();
                playerPieces[0].selected = 0;
            };
            if (e.key == 'x' && playerPieces[1].selected) {
                playerPieces[1].buffAttack();
                playerPieces[1].selected = 0;
            };
            if (e.key == 'z') {
                p.attackQueen();
            };
            availableMoves = [];
        }
        p.findLegalMoves(e.key);
    });
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
    drawInformationSection();
    drawBoard();
    allPiece = [...availableMoves, ...playerPieces, queenPiece].sort(function (a, b) { return a.y - b.y });

    allPiece.forEach(e => {
        e.draw()
    });
    drawInfoText();
    timingFunction();
}, 1 / 60);

function timingFunction() {
    dt++
    if (dt > 30) {
        time += 0.5;
        dt = 0;
    };
};

function drawInfoText() {
    if (playSpecial == 1) {
        infoTextLocation.forEach(i => {
            let sign = i.v >= 0 ? '+' : '-';

            ctx.save();
            if (i.t == 'h') {

                ctx.drawImage(heartImg, i.x, i.y--, 20, 20);
            } else if (i.t == 'a') {
                ctx.drawImage(swordImg, i.x, i.y--, 20, 20);
            }
            ctx.restore();
            drawText(sign + Math.abs(i.v), i.x + 50, (i.y + 9), 40, 'white')
            if (i.y < i.o - 35) {
                infoTextLocation = [];
                playSpecial = 0
            };
        });
    };
};