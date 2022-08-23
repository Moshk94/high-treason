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
let moveTo;

class Piece {
    animateHP(s = 1){
     if(this.newHP > this.currentHP && this.newHP <= this.maxHP){
            this.currentHP += s
        } else   if (this.newHP < this.currentHP && this.newHP >= 0) {
            this.currentHP -= s
        }
        
        this.currentHP <= 0 ? this.currentHP = 0 : 0;
        this.currentHP >= this.maxHP ? this.currentHP = this.maxHP : 0; 
    };
    getBoardCoords(c) {
        return {
            x: (c - 1) % 7,
            y: Math.ceil(c / 7) - 1,
        };
    };
};

class Queen extends Piece {
    constructor(position) {
        super();
        this.position = position;
        this.attack = 30;
        this.currentHP = 1;
        this.maxHP = 300;
        this.newHP = this.maxHP;
    };
    draw() {
        this.drawQueenInformationSection();
        this.x = 130 + (this.getBoardCoords(this.position).x * 50);
        this.y = 180 + (50 * 0.8 * this.getBoardCoords(this.position).y);
        ctx.save();
        ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(2deg)';
        ctx.drawImage(queenImg, this.x - 5, this.y - 20);
        ctx.restore();

        this.animateHP(5);

    };
    drawQueenInformationSection() {
        ctx.fillStyle = "black";
        ctx.fillRect(boardX, boardY - cellSize * 2, 350, 50);

        ctx.fillStyle = "grey"
        ctx.fillRect(boardX, boardY - cellSize * 2, 350, 20);

        ctx.fillStyle = "green"
        ctx.fillRect(boardX, boardY - cellSize * 2, 350 * (this.currentHP / this.maxHP), 20);

        drawText(
            `${this.currentHP} / ${this.maxHP}`,
            boardX + 175,
            boardY - cellSize * 2 + 9,
            25,
            'white'
        );

        drawText(
            `Att: ${this.attack}`,
            boardX + 175,
            boardY - cellSize * 2 + 35,
            25,
            'darkred'
        );

        ctx.beginPath();
        ctx.strokeStyle = 'darkred';
        ctx.lineWidth = 5;
        ctx.arc(
            boardX,
            boardY - cellSize * 2 + 25,
            30,
            0,
            2 * PI
        );
        ctx.stroke();
        ctx.fillStyle = "black"
        ctx.fill();

        ctx.save();
        ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(2deg)';
        ctx.drawImage(queenImg, boardX - 25, boardY - 130);
        ctx.restore();
    };
};

class Moves extends Piece {
    constructor(position, owner) {
        super();
        this.position = position;
        this.owner = owner;
    };
    draw() {
        let ctxFilterString = `opacity(35%) sepia(100%) saturate(500%) hue-rotate(${this.owner}deg)`;

        this.x = 130 + (this.getBoardCoords(this.position).x * 50);
        this.y = 180 + (50 * 0.8 * this.getBoardCoords(this.position).y);

        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.restore();
    };
    click() {
        pawnArray.forEach(e => {
            if (e.type == this.owner) {
                moveTo = {
                    newPosition: this.position,
                    owner: this.owner
                }
            }
        });
    };
};

class Pawn extends Piece {
    constructor(position, type, attack) {
        super();
        this.type = type;
        this.position = position;
        this.x = 130 + (this.getBoardCoords(position).x * 50);
        this.y = 180 + (50 * 0.8 * this.getBoardCoords(position).y);
        this.currentHP = 1;
        this.maxHP = 100;
        this.attack = attack;
        this.newHP = this.maxHP;
    };
    draw(x = this.x, y = this.y, dx = 40, dy = 60) {
        if (moveTo != undefined && moveTo.owner == this.type) {
            let newX = 130 + (this.getBoardCoords(moveTo.newPosition).x * 50);
            let newY = 180 + (50 * 0.8 * this.getBoardCoords(moveTo.newPosition).y);
            let moveSpeed = 10;

            if (newX != this.x) {
                newX > this.x ? this.x += moveSpeed : this.x -= moveSpeed;
            };

            if (newY != this.y) {
                newY > this.y ? this.y += moveSpeed : this.y -= moveSpeed;
            };

            if (this.y == newY && this.x == newX) {
                ghostArray = [];
                this.position = moveTo.newPosition;
                moveTo = undefined;
            };
        };

        let ctxFilterString = `sepia(100%) saturate(500%) hue-rotate(${this.type}deg)`;

        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, x, y, dx, dy);
        ctx.restore();
        this.animateHP();
    };

    findLegalMoves() {
        let checkNorth = pawnArray.some(el => el.position === this.position - 7) || this.position - 7 == queenPiece.position;
        let checkSouth = pawnArray.some(el => el.position === this.position + 7) || this.position + 7 == queenPiece.position;
        let checkWest = pawnArray.some(el => el.position === this.position - 1) || this.position - 1 == queenPiece.position;
        let checkEast = pawnArray.some(el => el.position === this.position + 1) || this.position + 1 == queenPiece.position;

        if (this.position - 7 > 0 && !checkNorth) {
            ghostArray.push(new Moves(this.position - 7, this.type));
        };

        if (this.position + (7 * 1) <= 49 && !checkSouth) {
            ghostArray.push(new Moves(this.position + 7, this.type));
        };

        if (Math.ceil(this.position / 7) == Math.ceil((this.position - 1) / 7) && !checkWest) {
            ghostArray.push(new Moves(this.position - 1, this.type));
        };

        if (Math.ceil(this.position / 7) == Math.ceil((this.position + 1) / 7) && !checkEast) {
            ghostArray.push(new Moves(this.position + 1, this.type));
        };
    };
};

let queenPiece = new Queen(4);
let ghostArray = [];
export let pawnArray = [
    new Pawn(44, 50, 10),
    new Pawn(48, -60, 10),
    new Pawn(39, 0, 20),
];

canvas.addEventListener('keydown', function (e) {
    console.log(e.keyCode)
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
    drawInformationSection();
    drawBoard();
    allPiece = [...ghostArray, ...pawnArray, queenPiece].sort(function (a, b) { return a.position - b.position });
    allPiece.forEach(e => { e.draw(); });

}, 1 / 60);

