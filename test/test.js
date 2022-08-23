import { drawDebuggerGrid, drawText, drawBoard } from "./debugTools";

export const ctx = document.getElementById('canvas').getContext("2d");
export const boardX = 125;
export const boardY = 200;
export const cellSize = 50;
const pawnImg = new Image();
const queenImg = new Image();
const PI = Math.PI;

queenImg.src = 'q.png'
pawnImg.src = 'p.png';

let allPiece;
let moveTo;

class Piece {
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
        this.currentHP = 100;
        this.maxHP = 100;
        this.newHP = this.currentHP;
    };
    draw() {
        this.drawQueenInformationSection();
        this.x = 130 + (this.getBoardCoords(this.position).x * 50);
        this.y = 180 + (50 * 0.8 * this.getBoardCoords(this.position).y);
        ctx.save();
        ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(2deg)';
        ctx.drawImage(queenImg, this.x - 5, this.y - 20);
        ctx.restore();

        if (this.newHP != this.currentHP && this.newHP >= 0) {
            this.currentHP -= 1
        }

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
        this.currentHP = 100;
        this.maxHP = 100;
        this.attack = attack;
        this.attacking = 0
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

        this.currentHP <= 0 ? this.currentHP = 0 : 0;
        this.currentHP >= this.maxHP ? this.currentHP = this.maxHP : 0;

        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, x, y, dx, dy);
        ctx.restore();
    };
    
    findLegalMoves() {
        let checkNorth = pawnArray.some(el => el.position === this.position - 7) || this.position - 7 == queenArray.position;
        let checkSouth = pawnArray.some(el => el.position === this.position + 7) || this.position + 7 == queenArray.position;
        let checkWest = pawnArray.some(el => el.position === this.position - 1) || this.position - 1 == queenArray.position;
        let checkEast = pawnArray.some(el => el.position === this.position + 1) || this.position + 1 == queenArray.position;

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

let ghostArray = [];
let pawnArray = [
    new Pawn(44, 50, 10),
    new Pawn(48, -60, 10),
    new Pawn(39, 0, 20),
];
let queenArray = new Queen(4);

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
    drawInformationSection();
    drawBoard();
    allPiece = [...ghostArray, ...pawnArray, queenArray].sort(function (a, b) { return a.position - b.position });
    allPiece.forEach(e => { e.draw(); });

}, 1 / 60);


function drawInformationSection() {
    for (let i = 0; i < pawnArray.length; i++) {
        const infoX = boardX - 50 + (175 * i);
        const dx = 20;

        ctx.fillStyle = "black";
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 75);

        ctx.fillStyle = "grey"
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 20);

        drawText(`${pawnArray[i].currentHP} / ${pawnArray[i].maxHP}`,infoX + 75,boardY + cellSize * 7 - 16,25,'white');

        drawText(`Att: ${pawnArray[i].attack}`,infoX + 75,boardY + cellSize * 7 + 10,25,'darkred');

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.arc(infoX,boardY + cellSize * 7 - 10,20,0,2 * PI);
        ctx.stroke();
        ctx.fillStyle = "black"
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 3;
        ctx.arc(infoX,boardY + cellSize * 7 - 10,20,-PI / 2, (PI * 2) * pawnArray[i].currentHP / pawnArray[i].maxHP - PI / 2);
        ctx.stroke();

        pawnArray[i].draw(infoX - 10, boardY + cellSize * 7 - 25, dx, dx * 1.5);
    };
};