import { drawTitlePage, changeSelection } from './titlepage.js'
import { gamePhase, screenFade } from './transitions.js'
import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { changePauseSelection } from './pauseScreen.js';
import { changeTransitionTo } from "./transitions";
import { drawBoard, boardX, boardY, cellSize } from './boardUI.js';
import { rads, FLOOR, dir, drawText} from './helperFunctions.js';

export const ctx = document.getElementById('canvas').getContext("2d");
export let allPiece;
export let playerTurn = 1;
export let moveTo;
export const PI = Math.PI;

const pawnImg = new Image();
const queenImg = new Image();

pawnImg.src = 'p.png';
queenImg.src = 'q.png';

let fired = false;
let queenPiece;
let playerPieces = [];
let time = 0;
let moveToo;
let turn = 0;
let availableMoves = [];
let start;
let specialUI = [];
let playSpecial = 0;

export class Piece {
    constructor() {
    }
    draw() {
        this.score = this.updateScore();
    }
    parsePosition(n) {
        return {
            y: 180 + (40 * (FLOOR(n / 7))),
            x: 130 + (50 * (n % 7))
        };
    };
    findLegalMoves() {
        let legalMoves = [];
        let straights = [-7, 7, -1, 1];

        straights.forEach(f => {
            let coord = this.boardPosition + f;
            if (coord >= 0 && coord <= 48 &&
                this.parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                this.parsePosition(this.boardPosition + f).x <= this.x + 50) {
                legalMoves.push(coord);
            };
        });
        return legalMoves;
    };
    animateMovement() {
        if (this.tempY == undefined) {
            this.moveX < this.x ? this.x -= 5 : 0;
            this.moveX > this.x ? this.x += 5 : 0;
            this.moveY > this.y ? this.y += 5 : 0;
            this.moveY < this.y ? this.y -= 5 : 0;
        } else {
            this.tempY < this.y ? this.y -= 5 / 2 : 0;
            if (this.tempY - 5 < this.y && specialUI.length != 0) {
                playSpecial = 1;
            }
            if (this.tempY == this.y && specialUI.length != 0) {
                this.tempY = undefined;
            };
        };
    };
    updateScore() {
        let preCalc = this.t == "P" ? 1 : -1;
        let modifier = this.currentHP > 0 ? preCalc : 0;
        return (this.currentHP + (this.attack / 0.1)) * modifier;
    };
    animateHP() {
        this.hpAnimate < this.currentHP ? this.currentHP -= 2 : 0;
        this.hpAnimate > this.currentHP ? this.currentHP += 2 : 0;

        this.currentHP <= 0 ? this.currentHP = 0 : 0;
        this.currentHP >= this.maxHP ? this.currentHP = this.maxHP : 0;

        this.hpAnimate <= 0 ? this.hpAnimate = 0 : 0;
        this.hpAnimate >= this.maxHP ? this.hpAnimate = this.maxHP : 0;
    };
    animateSpecial() {
        this.tempY = this.y - 30;
    };
    buffAttack() {
        if (this.t == "Q") {
            const ids = playerPieces.map(object => {
                return object.currentHP;
            });

            const max = Math.max(...ids);
            if (this.attack < max) {
                specialUI.push({ t: 'a', v: 10, l: this, y: this.y });
            } else {
                this.cursePiece();
            }
        } else {
            let diagonals = [-8, -6, 6, 8];
            let piecesToBuff = []
            diagonals.forEach(f => {
                let coord = this.boardPosition + f;
                if (coord >= 0 && coord <= 48 &&
                    this.parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                    this.parsePosition(this.boardPosition + f).x <= this.x + 50) {
                    let fi = playerPieces.findIndex(i => i.boardPosition == coord);
                    if (fi > -1) {
                        piecesToBuff.push(playerPieces[fi])
                    }
                };
            });
            return piecesToBuff;
        };

        this.animateSpecial()
    };
    heal() {
        let healValue;
        if (this.t == "Q") {
            if (this.currentHP == this.maxHP) {
                this.cursePiece();
            } else {
                healValue = 10;
                specialUI.push({ t: 'h', v: healValue, l: this, y: this.y });
                this.animateSpecial();
            };
        } else {
            let piecesToHeal = [];
            let diagonals = [-8, -6, 6, 8, 0];

            diagonals.forEach(f => {
                let coord = this.boardPosition + f;
                if (coord >= 0 && coord <= 48 &&
                    this.parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                    this.parsePosition(this.boardPosition + f).x <= this.x + 50) {
                    let fi = playerPieces.findIndex(i => i.boardPosition == coord);
                    if (fi > -1) {
                        let ty;
                        let val;
                        if (playerPieces[fi].cursed == 0) {
                            ty = 'h'
                            val = Math.min(playerPieces[fi].maxHP - playerPieces[fi].currentHP, 20);
                        } else {
                            ty = '-c';
                            val = 1;
                        }
                        piecesToHeal.push({ t: ty, v: val, l: playerPieces[fi], y: playerPieces[fi].y });
                    };
                };
            });
            return piecesToHeal
        };
    };
    attackAnimation(p, v) {
        playSpecial = 1;
        this.x -= ((this.x - p.x) / 2);
        this.y -= ((this.y - p.y) / 2);
        specialUI.push({ t: 'd', v: v, l: p, y: p.y })
    };
};

export class Moves extends Piece {
    constructor(p, owner) {
        super();
        this.x = this.parsePosition(p).x;
        this.y = this.parsePosition(p).y;
        this.color = `${owner.color} opacity(50%)`;
        this.position = p;
    };
    draw() {
        ctx.save();
        ctx.filter = this.color;
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.restore();
    };
};

class Queen extends Piece {
    constructor(boardPosition) {
        super();
        this.x = this.parsePosition(boardPosition).x;
        this.y = this.parsePosition(boardPosition).y;
        this.boardPosition = boardPosition;
        this.currentHP = 1;
        this.maxHP = 100;
        this.hpAnimate = this.maxHP;
        this.moveY = this.y;
        this.moveX = this.x;
        this.score = 0;
        this.attack = 5;
        this.t = "Q";
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.filter = 'brightness(50%)';
        ctx.drawImage(queenImg, this.x - 5, this.y - 20);
        ctx.restore();
        this.animateMovement()
        this.animateHP()
    };
    findLegalMoves() {
        let moves = super.findLegalMoves();
        let diagonals = [-8, -6, 6, 8];
        diagonals.forEach(f => {
            let coord = this.boardPosition + f;
            if (coord >= 0 && coord <= 48 &&
                this.parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                this.parsePosition(this.boardPosition + f).x <= this.x + 50) {
                moves.push(coord)
            };
        });
        return moves;
    };
    cursePiece() {
        let max = -Infinity,
            strongPiece

        playerPieces.forEach(function (v, k) {
            if (v.currentHP > 0) {
                if (max < v.attack) {
                    max = v.attack;
                    strongPiece = k;
                };
            };
        });
        specialUI.push({ t: 'c', l: playerPieces[strongPiece], s: 1, o: 1 })
        this.animateSpecial()
    }
    moveQueen() {
        if (!playerTurn && moveToo == undefined && !isGameOver()) {

            if ((turn/3) % 5 == 0 && turn > 0) {
                this.cursePiece();
            } else if ((turn/2) % 5 == 0 && turn > 0) {
                this.heal();
            } else if ((turn % 5) == 0 && turn > 0) {
                this.buffAttack();
            } else {
                let newBoard = [...playerPieces, queenPiece];
                findBestMove(newBoard, 2, false);
                moveToo = moveTo;
                let pI = playerPieces.findIndex(i => i.boardPosition === moveToo);
                if (pI < 0) {
                    this.moveX = this.parsePosition(moveToo).x;
                    this.moveY = this.parsePosition(moveToo).y;
                    this.boardPosition = moveToo;
                } else {
                    this.attackAnimation(playerPieces[pI], this.attack);
                };
            };
        };
    };
};

class Pawn extends Piece {
    constructor(boardPosition, k) {
        super();
        this.x = this.parsePosition(boardPosition).x;
        this.y = this.parsePosition(boardPosition).y;
        this.currentHP = 1;
        this.maxHP = 100;
        this.key = k;
        this.hpAnimate = this.maxHP;
        this.selected = 0;
        this.boardPosition = boardPosition;
        this.moveY = this.y;
        this.moveX = this.x;
        this.attack = this.key == 3 ? 20 : 10;
        this.t = "P";
        this.cursed = 0;
        this.angle = 0;
        this.dead = 0;
        this.opacity = 100
    };
    draw(x = this.x, y = this.y, w = 40, h = 60, i = 0) {
        super.draw();

        let deg;
        this.key == 1 ? deg = 120 : 0;
        this.key == 2 ? deg = 0 : 0;
        this.key == 3 ? deg = 180 : 0;
        ctx.save();
        
        if(this.hpAnimate == 0 && !i){
            this.moveY = this.parsePosition(this.boardPosition).y + 25;
            this.opacity > 0 ? this.opacity-=10 : this.opacity = 0;
            this.color = `brightness(50%) hue-rotate(${deg}deg) opacity(${this.opacity}%)`;
        } else {
            this.color = `brightness(50%) hue-rotate(${deg}deg)`;
        };
        ctx.filter = this.color;
        ctx.drawImage(pawnImg, x, y, w, h);
        ctx.restore();
        this.animateMovement();
        this.animateHP();
    };
    attackPiece() {
        let canAttack = false;
        let diagonals = [-8, -6, 6, 8];
        diagonals.forEach(f => {
            let coord = this.boardPosition + f;
            if (coord >= 0 && coord <= 48 &&
                queenPiece.boardPosition == coord &&
                this.parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                this.parsePosition(this.boardPosition + f).x <= this.x + 50) {
                canAttack = true;
            };
        });
        return canAttack;
    };
};
canvas.onkeyup = function () { fired = false };

canvas.addEventListener('keydown', function (e) {
    if (!fired) {
        fired = true;
        if (gamePhase == 0) {
            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                changeSelection();
            }
            if (e.key == 'z') {
                queenPiece = undefined;
                playerPieces = [];
                queenPiece = new Queen(10);
                playerPieces = [
                    new Pawn(44, 1),
                    new Pawn(38, 2),
                    new Pawn(46, 3)
                ];
                changeTransitionTo(changeSelection(1));
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
    }
});

setInterval( timestamp => {
    start ? 0 : start = timestamp;
    const elapsed = timestamp - start;
    time = elapsed / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gamePhase == 0) {
        // Title Screen
        drawTitlePage();
    } else if (gamePhase == 2.1) {
        // Help Page 1
        drawHelpPlayer();
    } else if (gamePhase == 2.2) {
        // Help Page 2
        drawHelpEnemy();
    } else if (gamePhase == 3 || gamePhase == -1) {
        drawBoard();
        allPiece = [...availableMoves, ...playerPieces, queenPiece].sort(function (a, b) { return a.y - b.y });
        allPiece.forEach(e => { e.draw() });
        drawInformationSection();
        if (playerTurn == 0 && time > 0.25) {
            queenPiece.moveQueen();
            playerTurn = 1;
            moveToo = undefined;
            playerPieces.forEach(c => {
                if (c.cursed > 0) {
                    c.hpAnimate -= c.cursed * 5;
                };
            });
        };
        if (playSpecial && specialUI.length > 0) {
            specialUI.forEach(u => {
                let xPos = 130 + (50 * (u.l.boardPosition % 7));
                let yPos = 180 + (40 * (FLOOR(u.l.boardPosition / 7)));
                if (u.t == 'c') {
                    u.s += 10;
                    u.o -= 0.03;
    
                    drawText('☠️', xPos + 25, yPos, u.s, `rgba(0,0,0,${u.o})`);
                    if (u.o < 0) {
                        playSpecial = 0;
                        specialUI = [];
                        u.l.cursed++;
                        endMoves();
                    };
                } else if (u.t == 'h') {
                    u.y--;
                    drawText(`❤️+${u.v}`, xPos + 25, u.y, 25, `green`);
                    if (u.y == yPos - 15) { u.l.hpAnimate += 20 }
                    if (u.y < yPos - 30) {
    
                        playSpecial = 0;
                        specialUI = [];
                        endMoves();
                    };
                } else if (u.t == 'd') {
                    u.y--;
                    drawText(`❤️-${u.v}`, xPos + 25, u.y, 25, `red`);
                    if (u.y == yPos - 5) { u.l.hpAnimate -= u.v }
                    if (u.y < yPos - 30) {
                        playSpecial = 0;
                        specialUI = [];
                        endMoves();
                    };
                } else if (u.t == 'a') {
                    u.y--;
    
                    drawText(`⚔️+${u.v}`, xPos + 25, u.y, 30, `white`);
    
                    if (u.y == yPos - 15) { u.l.attack += u.v }
                    if (u.y <= yPos - 30) {
                        playSpecial = 0;
                        specialUI = [];
                        endMoves();
                    };
                } else if (u.t == '-c') {
                    u.y--;
                    drawText(`☠️-${u.v}`, xPos + 25, u.y, 25, `green`);
                    if (u.y == yPos - 15) { u.l.cursed -= u.v }
                    if (u.y < yPos - 30) {
                        playSpecial = 0;
                        specialUI = [];
                        endMoves();
                    };
                };
            });
        };
    };
    screenFade();
    
}, 1 / 60);


function drawInformationSection() {
    for (let i = 0; i < playerPieces.length; i++) {
        const infoX = boardX - 50 + (175 * i);
        const dx = 20;

        ctx.fillStyle = "black";
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 75);

        ctx.fillStyle = "grey"
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 20);

        drawText(`${playerPieces[i].currentHP} / ${playerPieces[i].maxHP}`, infoX + 75, boardY + cellSize * 7 - 16, 25, 'white');

        drawText(`⚔️${playerPieces[i].attack}`, infoX + 75, boardY + cellSize * 7 + 10, 25, 'white');
        let curseColor = playerPieces[i].cursed == 0 ? 'rgba(0,128,0,0.5)' : 'rgba(255,0,0,1)'
        drawText(`☠️${playerPieces[i].cursed}`, infoX + 75, boardY + cellSize * 7 + 36, 20, curseColor);

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.arc(infoX, boardY + cellSize * 7 - 10, 20, 0, 2 * PI);
        ctx.stroke();
        ctx.fillStyle = "black"
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 3;
        ctx.arc(infoX, boardY + cellSize * 7 - 10, 20, -PI / 2, (PI * 2) * playerPieces[i].currentHP / playerPieces[i].maxHP - PI / 2);
        ctx.stroke();

        playerPieces[i].draw(infoX - 10, boardY + cellSize * 7 - 25, dx, dx * 1.5, 1);
    };

    ctx.fillStyle = "black";
    ctx.fillRect(boardX, boardY - cellSize * 2, 350, 50);

    ctx.fillStyle = "grey"
    ctx.fillRect(boardX, boardY - cellSize * 2, 350, 20);

    ctx.fillStyle = "darkgreen"
    ctx.fillRect(boardX, boardY - cellSize * 2, 350 * (queenPiece.currentHP / queenPiece.maxHP), 20);

    drawText(`${queenPiece.currentHP} / ${queenPiece.maxHP}`, boardX + 175, boardY - cellSize * 2 + 9, 25, 'white');

    drawText(`⚔️${queenPiece.attack}`, boardX + 175, boardY - cellSize * 2 + 36, 25, 'white');

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

function findBestMove(MMBoard, depth, maximisingPlayer) {
    let qL = MMBoard[MMBoard.findIndex(i => i.t === "Q")]
    if (depth == 0 || qL.currentHP == 0) {
        let sc = 0
        MMBoard.forEach(s => {

            sc += s.updateScore()
        });
        return sc;
    };

    if (!maximisingPlayer) {
        let minEvaluation = Infinity;
        let qO = Object.assign(Object.create(Object.getPrototypeOf(qL)), qL);
        qL.findLegalMoves().forEach(m => {
            let pL = MMBoard[MMBoard.findIndex(i => i.boardPosition === m)];


            if (pL) {
                let pO = Object.assign(Object.create(Object.getPrototypeOf(pL)), pL);
                pL.currentHP -= qL.attack

                let calculateMinValue = findBestMove(MMBoard, depth - 1, true);
                pL.currentHP = pO.currentHP;
                if (calculateMinValue < minEvaluation) {
                    minEvaluation = calculateMinValue;
                    moveTo = m;
                };
            }

            if (!pL) {
                qL.boardPosition = m;
                let calculateMinValue = findBestMove(MMBoard, depth - 1, true);
                qL.boardPosition = qO.boardPosition;
                if (calculateMinValue < minEvaluation) {
                    minEvaluation = calculateMinValue;
                    moveTo = m;
                };
            }
        });
        return minEvaluation;
    };

    if (maximisingPlayer) {
        let maxEvaluation = -Infinity;
        MMBoard.forEach(p => {
            if (p.t == "P") {
                if (p.attackPiece()) {
                    let qO = Object.assign(Object.create(Object.getPrototypeOf(qL)), qL);
                    qL.currentHP -= p.attack;
                    let caclulatedMaxValue = findBestMove(MMBoard, depth - 1, false);
                    qL.currentHP = qO.currentHP;
                    if (caclulatedMaxValue > maxEvaluation) {
                        maxEvaluation = caclulatedMaxValue
                    };
                };

                p.findLegalMoves().forEach(m => {
                    let pO = Object.assign(Object.create(Object.getPrototypeOf(p)), p);
                    p.boardPosition = m;
                    let caclulatedMaxValue = findBestMove(MMBoard, depth - 1, false);
                    p.boardPosition = pO.boardPosition;
                    if (caclulatedMaxValue > maxEvaluation) {
                        maxEvaluation = caclulatedMaxValue
                    };
                })
            };
        });
        return maxEvaluation
    };
};