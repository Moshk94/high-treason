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
        if (this.newY < this.y) {
            this.y -= movementSpeed
        } else if (this.newY > this.y) {

            this.y += movementSpeed
        }
    };
    animateSpecial() {
        this.y -= 35
    }
    heal() {
        let healValue;
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
        });

        this.newHP += healValue;
        this.animateSpecial();
    }
    buffAttack() {
        diagonals = [{ x: 50, y: -40 }, { x: 50, y: 40 }, { x: -50, y: 40 }, { x: -50, y: -40 }];

        diagonals.forEach(d => {
            
            d.x += this.x
            d.y += this.y

            let c = playerPieces.findIndex(a => a.x === d.x && a.y === d.y)
            if (c >= 0) {
                console.log("")
                playerPieces[c].attack += 10
            }
        });

        this.attack += 10;
        this.animateSpecial();

    };
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
        this.key == 49 ? deg = 65 : 0;
        this.key == 50 ? deg = -60 : 0;
        this.key == 51 ? deg = 180 : 0;
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
        this.attack = keycode == 51 ? 20 : 10;
        this.newHP = 1; // this.maxHP;
        this.key = keycode;
        this.newX = this.x;
        this.newY = this.y;
        this.ctxFilterString
    };
    draw(x = this.x, y = this.y, w = 40, h = 60) {
        let deg;

        this.key == 49 ? deg = 65 : 0;
        this.key == 50 ? deg = -60 : 0;
        this.key == 51 ? deg = 180 : 0;


        this.ctxFilterString = `sepia(100%) saturate(500%) hue-rotate(${deg}deg)`;
        ctx.save();
        ctx.filter = this.ctxFilterString;
        ctx.drawImage(pawnImg, x, y, w, h);
        ctx.restore();
        this.animateHP();
        this.animateMovement();
    };
    attackPiece() { };
    findLegalMoves(p) {
        if (p == this.key) {
            playerPieces.forEach(p => { p.selected = 0 })
            availableMoves = [];
            this.selected = 1;
            let checkEast = playerPieces.some(el => el.x === this.x + 50 && this.y === el.y);
            let checkWest = playerPieces.some(el => el.x === this.x - 50 && this.y === el.y);
            let checkNorth = playerPieces.some(el => el.y === this.y - 40 && this.x === el.x);
            let checkSouth = playerPieces.some(el => el.y === this.y + 40 && this.x === el.x);

            if (this.x - 50 >= 130 && !checkWest) {
                availableMoves.push(new Moves({ k: this.key, x: this.x - 50, y: this.y, d: 37 }))
            }
            if (this.x + 50 < 480 && !checkEast) {
                availableMoves.push(new Moves({ k: this.key, x: this.x + 50, y: this.y, d: 39 }))
            }

            if (this.y - 40 >= 180 && !checkNorth) {
                availableMoves.push(new Moves({ k: this.key, x: this.x, y: this.y - 40, d: 38 }))
            }

            if (this.y + 40 < 460 && !checkSouth) {
                availableMoves.push(new Moves({ k: this.key, x: this.x, y: this.y + 40, d: 40 }))
            }
        };
    };
};

let availableMoves = [];
export let playerPieces = [
    new Pawn(49, 3, 3),
    new Pawn(50, 4, 4),
    new Pawn(51, 2, 4),
];

canvas.addEventListener('keydown', function (e) {
    // console.log(e.keyCode);
    playerPieces.forEach(p => {
        if (p.selected) {
            let findD = availableMoves.findIndex(ee => ee.direction == e.keyCode);
            if (findD >= 0) {
                if (e.keyCode == 38) {
                    p.newY -= 40;
                }
                if (e.keyCode == 37) {
                    p.newX -= 50;
                }
                if (e.keyCode == 39) {
                    p.newX += 50;
                }
                if (e.keyCode == 40) {
                    p.newY += 40;
                }
                p.selected = 0;
            }
            if (e.keyCode == 88 && playerPieces[0].selected) {
                playerPieces[0].heal();
                playerPieces[0].selected = 0;
            };
            if (e.keyCode == 88 && playerPieces[1].selected) {
                playerPieces[1].buffAttack();
                playerPieces[1].selected = 0;
            };
            availableMoves = [];
        }
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