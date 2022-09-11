import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { changePauseSelection, pauseScreen} from './pauseScreen.js';
import { drawBoard, boardX, boardY, cellSize } from './boardUI.js';
import { rads, FLOOR, dir, drawText, drawTextWithShadow } from './helperFunctions.js';
import pawnsrc from './imgs/p.png'
import queensrc from './imgs/q.png'


export const ctx = document.getElementById('canvas').getContext("2d");
export let allPiece;
let playerTurn = 1;
export let moveTo;
export const PI = Math.PI;

export const pawnImg = new Image();
export const queenImg = new Image();
const transitionSpeed = 0.06;

let isTransioning = 0;
let alpha = 0;
let transitionTo;
let selectedOption = 3;
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
let lock = false;
let gamePhase = 0;

pawnImg.src = pawnsrc;
queenImg.src = queensrc;
step();
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
            if ((turn / 3) % 5 == 0 && turn > 0) {
                this.cursePiece();
            } else if ((turn / 2) % 5 == 0 && turn > 0) {
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

        if (this.hpAnimate == 0 && !i) {
            this.moveY = this.parsePosition(this.boardPosition).y + 25;
            this.opacity > 0 ? this.opacity -= 10 : this.opacity = 0;
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
                playerTurn = 1;
                changeTransitionTo(changeSelection(1));
            };
        } else if (gamePhase == 3) {
            // INFO: Game key function will go here.
            if (playerTurn) {
                if (e.key < 4) {
                    availableMoves = [];
                    playerPieces.forEach(z => {
                        z.selected = 0;
                    });

                    if (e.key == 1 && playerPieces[e.key - 1].hpAnimate> 0) {
                        playerPieces[e.key - 1].selected = 1;
                        playerPieces[e.key - 1].findLegalMoves().forEach(m => {
                            availableMoves.push(new Moves(m, playerPieces[e.key - 1]));
                        });
                    };
                    if (e.key == 2 && playerPieces[e.key - 1].hpAnimate > 0) {
                        playerPieces[e.key - 1].selected = 1;
                        playerPieces[e.key - 1].findLegalMoves().forEach(m => {
                            availableMoves.push(new Moves(m, playerPieces[e.key - 1]));
                        });
                    };
                    if (e.key == 3 && playerPieces[e.key - 1].hpAnimate > 0) {
                        playerPieces[e.key - 1].selected = 1;
                        playerPieces[e.key - 1].findLegalMoves().forEach(m => {
                            availableMoves.push(new Moves(m, playerPieces[e.key - 1]));
                        });
                    };
                };
            };
            if (e.key == 'x') {
                if (playerPieces[0].selected) {
                    let piecesToHealCure = playerPieces[0].heal();
                    piecesToHealCure.forEach(pHC => {
                        specialUI.push(pHC)
                    });
                    playerPieces[0].animateSpecial();
                    lock = false
                    playerPieces[0].selected = 0;
                } else if (playerPieces[1].selected) {
                    let piecesToBuff = playerPieces[1].buffAttack();
                    specialUI.push({ t: 'a', v: 5, l: playerPieces[1], y: playerPieces[1].y });
                    if (piecesToBuff.length > 0) {
                        piecesToBuff.forEach(b => {
                            specialUI.push({ t: 'a', v: 10, l: b, y: b.y })
                        });
                    };
                    lock = false
                    playerPieces[1].animateSpecial();
                };
                availableMoves = [];
            };
            let findSelectedIndex = playerPieces.findIndex(i => i.selected == 1);
            if (findSelectedIndex >= 0) {
                if (e.key == 'ArrowUp') {
                    movePiece(dir[e.key], findSelectedIndex);
                };
                if (e.key == 'ArrowDown') {
                    movePiece(dir[e.key], findSelectedIndex);
                };
                if (e.key == 'ArrowLeft') {
                    movePiece(dir[e.key], findSelectedIndex);
                };
                if (e.key == 'ArrowRight') {
                    movePiece(dir[e.key], findSelectedIndex);
                };
                if (e.key == 'z') {
                    let s = playerPieces[findSelectedIndex];

                    if (s.attackPiece()) {
                        playerPieces[findSelectedIndex].attackAnimation(queenPiece, playerPieces[findSelectedIndex].attack);
                        lock = false
                        endMoves();
                    };
                    availableMoves = [];
                    s.selected = 0;
                };
            };

            if (e.key == 'Escape') {
                changeTransitionTo(-1);
                changePauseSelection(3);
            }
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

function step(timestamp) {
    window.requestAnimationFrame(step);
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
        allPiece.forEach(e => { if (e) { e.draw() } });
        if (playerPieces.length > 0 && queenPiece) { drawInformationSection() }
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
};


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
                if (calculateMinValue <= minEvaluation) {
                    minEvaluation = calculateMinValue;
                    moveTo = m;
                };
            }

            if (!pL) {
                qL.boardPosition = m;
                let calculateMinValue = findBestMove(MMBoard, depth - 1, true);
                qL.boardPosition = qO.boardPosition;
                if (calculateMinValue <= minEvaluation) {
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
function movePiece(v, c) {
    let s = playerPieces[c];
    if (availableMoves.findIndex(i => i.position == s.boardPosition + v.p) >= 0 &&
        allPiece.findIndex(i => i.boardPosition == s.boardPosition + v.p) == -1) {

        s.moveY += v.y;
        s.moveX += v.x;
        s.selected = 0;
        s.boardPosition += v.p;
        lock = false
        endMoves();
    };
    availableMoves = [];
};

function endMoves() {
    if (playerTurn && !lock) {
        turn++
        playerTurn = 0;
        time = 0
        start = 0;
        lock = true
    };
};

function isGameOver(){
    let queenHealth = queenPiece.hpAnimate;
    let sumOfAllPlayerHealth = 0;
    playerPieces.forEach(h =>{
        sumOfAllPlayerHealth+=h.hpAnimate;
    })

    if(queenHealth == 0 || sumOfAllPlayerHealth == 0){
        return true;
    } else {
        return false;
    };
};


export function changeSelection(x) {
    if (x) {
        return selectedOption
    } else {
        if (selectedOption == 3) {
            selectedOption = 2.1
        } else if (selectedOption == 2.1) {
            selectedOption = 3
        };
    };
};

export function drawTitlePage() {
    const TITLE = 'HIGH TREASON';
    drawTextWithShadow(TITLE, canvas.width / 2, 310, 90);
    if (selectedOption == 3) {
        drawTextWithShadow("PLAY", canvas.width / 2, 405, 70, "yellow");
        drawTextWithShadow("HELP", canvas.width / 2, 465, 50, "white");
    } else {
        drawTextWithShadow("PLAY", canvas.width / 2, 405, 70, "white");
        drawTextWithShadow("HELP", canvas.width / 2, 465, 50, "yellow");
    }
};

// Transitions

export function screenFade() {
    if (isTransioning) {
        if (gamePhase == 3 && transitionTo == -1) {
            if (alpha < 0.8) {
                alpha += transitionSpeed;
            } else {
                gamePhase = transitionTo;
                isTransioning = 0;
            }
        } else if (gamePhase == -1 && transitionTo == 3) {
            if (alpha > 0) {
                alpha -= transitionSpeed;
            } else {
                gamePhase = transitionTo;
                isTransioning = 0;
            }
        } else {
            if (alpha <= 2) {
                alpha += transitionSpeed;
            } else if (alpha > 2) {
                gamePhase = transitionTo;
                isTransioning = 0;
            };
        }
    } if (!isTransioning) {
        if (gamePhase != -1) {
            if (alpha >= 0) {
                alpha -= (0.06);
                transitionTo = undefined;
            };
        };
    };

    if (gamePhase == -1) {
        if (transitionTo == 0) {
            pauseScreen();
            fade(alpha)
        } else {
            fade(alpha);
            pauseScreen();
        }
    } else {fade(alpha)}
};

export function changeTransitionTo(x) {
    transitionTo = x;
    isTransioning = 1;
};

function fade(ap) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(0, 0, 0, ${ap})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
}