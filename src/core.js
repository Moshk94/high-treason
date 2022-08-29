import { drawTitlePage, changeSelection } from './titlepage.js'
import { gamePhase, screenFade } from './transitions.js'
import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { pauseScreen, changePauseSelection } from './playsScreen.js';
import { changeTransitionTo } from "./transitions";
import { drawBoard } from './boardUI.js';
import { drawText } from './helperFunctions.js';
export const ctx = document.getElementById('canvas').getContext("2d");

const boardX = 125;
const boardY = 200;
const cellSize = 50;
const PI = Math.PI;

const pawnImg = new Image();
pawnImg.src = 'p.png';

let allPiece;
let moveTo;

class Piece {
    isWithinBounds() {
        if (mouseX > this.x && mouseX < this.x + pawnImg.width &&
            mouseY > this.y && mouseY < this.y + pawnImg.height) {
            return true
        };
    };
    getBoardCoords(c) {
        return {
            x: (c - 1) % 7,
            y: Math.ceil(c / 7) - 1,
        };
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
    constructor(position, type) {
        super();
        this.type = type;
        this.position = position;
        this.x = 130 + (this.getBoardCoords(position).x * 50);
        this.y = 180 + (50 * 0.8 * this.getBoardCoords(position).y);
        this.currentHP = Math.floor(Math.random() * 100) + 1;
        this.maxHP = 100;
        this.attack = Math.floor(Math.random() * 50) + 1;
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
        this.selected ? ctxFilterString += 'drop-shadow(1px 1px 3px red)' : '';

        ctx.save();
        ctx.filter = ctxFilterString;
        ctx.drawImage(pawnImg, x, y, dx, dy);
        ctx.restore();
    };
    click() {
        if (this.isWithinBounds()) {
            this.selected = 1;
        };
    };
    findLegalMoves() {
        let checkNorth = pawnArray.some(el => el.position === this.position + 7);
        let checkSouth = pawnArray.some(el => el.position === this.position - 7);
        let checkEast = pawnArray.some(el => el.position === this.position + 1);
        let checkWest = pawnArray.some(el => el.position === this.position - 1);

        if (this.position + (7 * 1) <= 49 && !checkNorth) {
            ghostArray.push(new Moves(this.position + 7, this.type));
        };

        if (this.position - (7 * 1) >= 1 && !checkSouth) {
            ghostArray.push(new Moves(this.position + -7, this.type));
        };

        if (Math.ceil(this.position / 7) == Math.ceil((this.position + 1) / 7) && !checkEast) {
            ghostArray.push(new Moves(this.position + 1, this.type));
        };

        if (Math.ceil(this.position / 7) == Math.ceil((this.position - 1) / 7) && !checkWest) {
            ghostArray.push(new Moves(this.position - 1, this.type));
        };
    };
};

export let ghostArray = [];
export let pawnArray = [
    new Pawn(39, 90),
    new Pawn(45, -60),
    new Pawn(47, 200),
];

canvas.addEventListener('keydown', function (e) {
    if (gamePhase == 0) {
        if (e.key == 'ArrowUp') {
            changeSelection(3);
        } else if (e.key == 'ArrowDown') {
            changeSelection(2.1);
        }

        if (e.key == 'z') {
            changeTransitionTo(changeSelection());
        };
    } else if (gamePhase == 3 && e.key == 'Escape') {
        // INFO: Game key function will go here.
        changeTransitionTo(-1);
        changePauseSelection(3)
    } else if (gamePhase == -1) {
        if (e.key == 'Escape') {
            changeTransitionTo(3);
        } else if (e.key == 'ArrowUp') {
            changePauseSelection(3);
        } else if (e.key == 'ArrowDown') {
            changePauseSelection(0);
        }

        if (e.key == 'z') {
            changeTransitionTo(changePauseSelection());
        };
    };
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gamePhase == 0) {// Title Screen
        drawTitlePage();
    } else if (gamePhase == 2.1) { // Help Page 1
        drawHelpPlayer();
    } else if (gamePhase == 2.2) { // Help Page 2
        drawHelpEnemy();
    } else if (gamePhase == 3 || gamePhase == -1) {
        drawBoard();
        drawInformationSection();
        allPiece = [...ghostArray, ...pawnArray].sort(function (a, b) { return a.position - b.position });
        allPiece.forEach(e => { e.draw(); });
    };

    screenFade();
}, 1 / 60);


function drawInformationSection() {
    for (let i = 0; i < pawnArray.length; i++) {
        const infoX = boardX - 50 + (175 * i);
        const dx = 20;

        ctx.fillStyle = "black";
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 75);

        ctx.fillStyle = "grey"
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 20);

        drawText(
            `${pawnArray[i].currentHP} / ${pawnArray[i].maxHP}`,
            infoX + 75,
            boardY + cellSize * 7 - 16,
            25,
            'white'
        );

        drawText(
            `Att: ${pawnArray[i].attack}`,
            infoX + 75,
            boardY + cellSize * 7 + 10,
            25,
            'white'
        );

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.arc(
            infoX,
            boardY + cellSize * 7 - 10,
            20,
            0,
            2 * PI
        );
        ctx.stroke();
        ctx.fillStyle = "black"
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 3;
        ctx.arc(
            infoX,
            boardY + cellSize * 7 - 10,
            20,
            -PI / 2, (PI * 2) * pawnArray[i].currentHP / pawnArray[i].maxHP - PI / 2
        );
        ctx.stroke();
        pawnArray[i].draw(infoX - 10, boardY + cellSize * 7 - 25, dx, dx * 1.5);
    };
};

export function resetGame() {
    // console.log("reseting")
    // pawnArray = [
    //     new Pawn(39, 90),
    //     new Pawn(45, -60),
    //     new Pawn(47, 200),
    // ];
    // ghostArray = [];
}