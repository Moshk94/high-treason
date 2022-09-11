import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { changePauseSelection, pauseScreen } from './pauseScreen.js';
import { drawBoard, boardX, boardY, cellSize } from './boardUI.js';
import { rads, FLOOR, drawText, drawTextWithShadow } from './helperFunctions.js';
import { changeEndSelection } from './endScreen.js';
import { endScreen } from './endScreen.js';
import pawnsrc from './imgs/p.png'
import queensrc from './imgs/q.png'
import arrowsrc from './imgs/arrow.png'
import zsrc from './imgs/z.png'
import onekeysrc from './imgs/1.png'
import twokeysrc from './imgs/2.png'
import threekeysrc from './imgs/3.png'
import xkeysrc from './imgs/x.png'

export const ctx = document.getElementById('canvas').getContext("2d");
export const PI = Math.PI;
export const pawnImg = new Image();
export const queenImg = new Image();
export const arrowImg = new Image();
export const zImg = new Image();
export const onekeyImg = new Image();
export const twokeyImg = new Image();
export const threekeyImg = new Image();
export const xkeyImg = new Image();

export let queenPiece;
export let isTransioning = 0;
export let allPiece;
export let moveTo;
export let speed = 5;

const transitionSpeed = 0.06;

let playerTurn = 1;
let alpha = 0;
let transitionTo;
let selectedOption = 3;
let fired = false;
let playerPieces = [];
let time = 0;
let moveToo;
let turn = 0;
let availableMoves = [];
let start;
let specialUI = [];
let lock = false;
let gamePhase = 0;
let doneCurse = 0;
let specialAnimation = 0;

pawnImg.src = pawnsrc;
queenImg.src = queensrc;
arrowImg.src = arrowsrc;
zImg.src = zsrc;
onekeyImg.src = onekeysrc;
twokeyImg.src = twokeysrc;
threekeyImg.src = threekeysrc;
xkeyImg.src = xkeysrc;
function parsePosition(n) {
    return {
        y: 180 + (40 * (FLOOR(n / 7))),
        x: 130 + (50 * (n % 7))
    };
};

const dir = {
    'ArrowUp': {
        x: 0,
        y: -speed,
        p: -7
    },
    'ArrowDown': {
        x: 0,
        y: speed,
        p: 7
    },
    'ArrowRight': {
        x: speed,
        y: 0,
        p: 1
    },
    'ArrowLeft': {
        x: -speed,
        y: 0,
        p: -1
    },
};

export class Piece {
    constructor() {
    }
    draw() {
        if (!this.init) {
            this.init = 1;
            this.x = parsePosition(this.boardPosition).x;
            this.y = parsePosition(this.boardPosition).y;
            this.currentHP = 0;
            this.hpAnimate = this.maxHP;
            this.score = 0;
            this.t = this.constructor.name.substring(0, 1);
            this.direction = this.boardPosition;
            this.dy = 0;
            this.dx = 0;
            this.opacity = 100;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.score = this.updateScore();
        if (this.hpAnimate == 0) { this.opacity > 0 ? this.opacity -= 10 : this.opacity = 0 }
        this.score = this.updateScore();
        this.movePieceTo();
        this.attackAnimation();
        this.animateSpecial();
    }
    movePieceTo() {
        if (this.t == "Q") {
            if (this.direction !== this.boardPosition) {
                let nD = parsePosition(this.direction);
                this.x != nD.x ? this.dx = -speed * Math.sign(this.x - nD.x) : 0;
                this.y != nD.y ? this.dy = 0.8 * -speed * Math.sign(this.y - nD.y) : 0;

                if (this.x == nD.x && this.y == nD.y) {
                    this.boardPosition = this.direction;
                    this.dy = this.dx = 0;
                }
            }
        } else {
            if (this.direction !== this.boardPosition) {
                let oD = parsePosition(this.boardPosition);
                if (this.x == oD.x && this.y == oD.y) {
                    this.direction = this.boardPosition;
                    this.dy = this.dx = 0;
                };
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
        if (this.playSpecial) {
            let pieceCoords = parsePosition(this.boardPosition);
            this.dy == 0 ? this.dy = -1 : 0;
            this.y < pieceCoords.y - 25 ? this.dy = 5 : 0;

            if ((this.y > pieceCoords.y)) {
                this.dy = 0;
                this.playSpecial = 0;
                this.y = pieceCoords.y;
                specialAnimation = 1;
            };
        };
    };
    buffAttack() {
        if (this.t == "Q") {
            const ids = playerPieces.map(object => {
                return object.currentHP;
            });

            const max = Math.max(...ids);
            if (this.attack < max) {
                specialUI.push({ t: 'a', v: 10, l: this, y: this.y });
                this.playSpecial = 1;
            } else {
                this.cursePiece();
            }
        } else {
            let diagonals = [-8, -7, -6, -1, 0, 1, 6, 7, 8];
            let piecesToBuff = []
            diagonals.forEach(f => {
                let coord = this.boardPosition + f;
                if (coord >= 0 && coord <= 48 &&
                    parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                    parsePosition(this.boardPosition + f).x <= this.x + 50) {
                    let fi = playerPieces.findIndex(i => i.boardPosition == coord);
                    if (fi > -1 && playerPieces[fi].hpAnimate > 0) {
                        piecesToBuff.push(playerPieces[fi])
                    }
                };
            });
            return piecesToBuff;
        };
        this.animateSpecial();
    };
    heal() {
        let healValue;
        if (this.t == "Q") {
            if (this.currentHP == this.maxHP) {
                this.buffAttack();
            } else {
                healValue = 20;
                specialUI.push({ t: 'h', v: healValue, l: this, y: this.y });
                this.playSpecial = 1;
                this.animateSpecial();
            };
        } else {
            let piecesToHeal = [];
            let diagonals = [-16, -16, -15, -14, -13, -12, -9, -8, -7, -6, -2, -1, 0, 1, 2, 6, 7, 8, 9, 12, 13, 14, 15, 16, 16];
            diagonals.forEach(f => {
                let coord = this.boardPosition + f;
                if (coord >= 0 && coord <= 48 &&
                    parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                    parsePosition(this.boardPosition + f).x <= this.x + 50) {
                    let fi = playerPieces.findIndex(i => i.boardPosition == coord);
                    if (fi > -1) {
                        let ty;
                        let val;
                        if (playerPieces[fi].hpAnimate > 0) {
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
                };
            });
            return piecesToHeal
        };
    };
    attackAnimation() {
        let pieceCoords = parsePosition(this.boardPosition);
        let q;
        this.t == "P" ? q = queenPiece : q = this.attackPiece;
        let targetCoords = parsePosition(q.boardPosition);

        if ((this.attackingX || this.attackingY) && specialUI.length == 0) {
            specialUI.push({ t: 'd', v: this.attack, l: q, y: q.y })
            specialAnimation = 1;
        };
        if (this.attackingY) {
            if (this.dy == 0) {
                this.dy = 0.8 * -speed * Math.sign(pieceCoords.y - targetCoords.y);
                this.dy == 0 ? this.attackingY = 0 : 0;
            } else if (this.dy != 0) {
                if (this.y > (pieceCoords.y + targetCoords.y) / 2 && Math.sign(this.dy) > 0) {
                    this.dy = 0.8 * (speed) * Math.sign(pieceCoords.y - targetCoords.y);
                }
                if (this.y < (pieceCoords.y + targetCoords.y) / 2 && Math.sign(this.dy) < 0) {
                    this.dy = 0.8 * (speed) * Math.sign(pieceCoords.y - targetCoords.y);
                }
                if (FLOOR(this.y) == pieceCoords.y) {
                    this.dy = 0;
                    this.attackingY = 0;
                };
            };
        };

        if (this.attackingX) {
            if (this.dx == 0) {
                this.dx = -speed * Math.sign(pieceCoords.x - targetCoords.x);
                this.dx == 0 ? this.attackingX = 0 : 0;
            } else if (this.dx != 0) {
                if (this.x > (pieceCoords.x + targetCoords.x) / 2 && Math.sign(this.dx) > 0) {
                    this.dx = (speed) * Math.sign(pieceCoords.x - targetCoords.x);
                }

                if (this.x < (pieceCoords.x + targetCoords.x) / 2 && Math.sign(this.dx) < 0) {
                    this.dx = (speed) * Math.sign(pieceCoords.x - targetCoords.x);
                }

                if (Math.floor(this.x) == pieceCoords.x) {
                    this.dx = 0;
                    this.attackingX = 0;
                };
            };
        };
    };
};

export class Moves extends Piece {
    constructor(p, owner) {
        super();
        this.x = parsePosition(p).x;
        this.y = parsePosition(p).y;
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
        this.boardPosition = boardPosition;
        this.maxHP = 100;
        this.attack = 10;
        this.attackPiece = this;
    }
    draw() {
        super.draw();
        ctx.save();
        ctx.filter = `sepia(100%) brightness(100%) opacity(${this.opacity}%)`;
        ctx.drawImage(queenImg, this.x - 5, this.y - 20);
        ctx.restore();
        this.animateHP();
    };
    findLegalMoves() {
        let moves = [];
        let diagonals = [-8, -7, -6, -1, 1, 6, 7, 8];
        diagonals.forEach(f => {
            let coord = this.boardPosition + f;
            if (coord >= 0 && coord <= 48 &&
                parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                parsePosition(this.boardPosition + f).x <= this.x + 50) {
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
        specialUI.push({ t: 'c', l: playerPieces[strongPiece], s: 1, o: 1 });
        this.playSpecial = 1;
        this.animateSpecial();
    }
    moveQueen() {
        if (!specialAnimation && !playerTurn && moveToo == undefined && !isGameOver()) {
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
                    this.direction = moveToo;
                } else {
                    this.attackingX = 1;
                    this.attackingY = 1;
                    this.attackPiece = playerPieces[pI]
                };
            };

            playerTurn = 1;
            doneCurse = 0;
            playerPieces.forEach(z => {
                if (z.hpAnimate == 0) {
                    z.boardPosition = z.direction = -1;
                }
            });
        };
    };
};

class Pawn extends Piece {
    constructor(boardPosition, k) {
        super();
        this.boardPosition = boardPosition;
        this.maxHP = 100;
        this.key = k;
        this.selected = 0;
        this.attack = this.key == 3 ? 20 : 10;
        this.cursed = 0;
    };
    draw(x = this.x, y = this.y, w = 40, h = 60, i = 0) {
        super.draw();
        let deg;
        this.key == 1 ? deg = 120 : 0;
        this.key == 2 ? deg = 0 : 0;
        this.key == 3 ? deg = 180 : 0;
        ctx.save();
        ctx.filter = this.color;
        if (!i) {
            this.color = `brightness(75%) hue-rotate(${deg}deg)`;
            ctx.drawImage(pawnImg, this.x, this.y, w, h);
        } else {
            this.color = `brightness(80%) hue-rotate(${deg}deg) opacity(${this.opacity}%)`;
            ctx.drawImage(pawnImg, x, y, w, h);
        }
        ctx.restore();
        this.animateHP();
    };
    attackPiece() {
        let canAttack = false;
        let directions = [-8, -7, -6, -1, 1, 6, 7, 8];
        directions.forEach(f => {
            let coord = this.boardPosition + f;
            if (coord >= 0 && coord <= 48 &&
                queenPiece.boardPosition == coord &&
                parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                parsePosition(this.boardPosition + f).x <= this.x + 50) {
                canAttack = true;
            };
        });
        return canAttack;
    };
    findLegalMoves() {
        let legalMoves = [];
        let straights = [-7, 7, -1, 1];
        straights.forEach(f => {
            let coord = this.boardPosition + f;
            let isOnTileIndex = allPiece.findIndex(i => i.boardPosition == coord);
            let isAlive;
            if (isOnTileIndex == -1 || allPiece[isOnTileIndex].animateHP > 0) {
                isAlive = 1
            }
            if (coord >= 0 && coord <= 48 &&
                parsePosition(this.boardPosition + f).x >= this.x - 50 &&
                parsePosition(this.boardPosition + f).x <= this.x + 50 &&
                isOnTileIndex == -1 && isAlive) {
                legalMoves.push(coord);
            };
        });
        return legalMoves;
    };
};
canvas.onkeyup = function () { fired = false };
function setupGame() {
    queenPiece = undefined;
    playerPieces = [];
    queenPiece = new Queen(10);
    playerPieces = [
        new Pawn(44, 1),
        new Pawn(38, 2),
        new Pawn(46, 3)
    ];
    playerTurn = 1;
}
canvas.addEventListener('keydown', function (e) {
    if (!fired) {
        fired = true;
        if (gamePhase == -1) {
            if (e.key == 'Escape') {
                changeTransitionTo(3);
            } else if (e.key == 'ArrowUp') {
                changePauseSelection(3);
            } else if (e.key == 'ArrowDown') {
                changePauseSelection(0);
            };

            if (e.key == 'z') {
                changeTransitionTo(changePauseSelection());
            };
        } else if (gamePhase == 0) {
            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                changeSelection();
            }
            if (e.key.toLowerCase() == 'z') {
                setupGame();
                changeTransitionTo(changeSelection(1));
            };
        } else if (gamePhase == 2.1 || gamePhase == 2.2) {
            if (e.key.toLowerCase() == 'z') {
                setupGame();
                changeTransitionTo(3);
            };

            gamePhase == 2.1 && e.key == 'ArrowRight' ? changeTransitionTo(2.2) : 0;
            gamePhase == 2.2 && e.key == 'ArrowLeft' ? changeTransitionTo(2.1) : 0;
        } else if (gamePhase == 3) {
            if (playerTurn) {
                if (e.key < 4) {
                    clearSelection();
                    availableMoves = [];
                    playerPieces.forEach(z => {
                        z.selected = 0;
                    });
                    if (e.key == 1 && playerPieces[e.key - 1].hpAnimate) {
                        playerPieces[e.key - 1].selected = 1;
                        playerPieces[e.key - 1].findLegalMoves().forEach(m => {
                            availableMoves.push(new Moves(m, playerPieces[e.key - 1]));
                        });
                    };
                    if (e.key == 2 && playerPieces[e.key - 1].hpAnimate) {
                        playerPieces[e.key - 1].selected = 1;
                        playerPieces[e.key - 1].findLegalMoves().forEach(m => {
                            availableMoves.push(new Moves(m, playerPieces[e.key - 1]));
                        });
                    };
                    if (e.key == 3 && playerPieces[e.key - 1].hpAnimate) {
                        playerPieces[e.key - 1].selected = 1;
                        playerPieces[e.key - 1].findLegalMoves().forEach(m => {
                            availableMoves.push(new Moves(m, playerPieces[e.key - 1]));
                        });
                    };
                };
                if (e.key.toLowerCase() == 'x') {
                    if (playerPieces[0].selected) {
                        let piecesToHealCure = playerPieces[0].heal();
                        piecesToHealCure.forEach(pHC => {
                            specialUI.push(pHC)
                        });
                        playerPieces[0].playSpecial = 1;
                        lock = false
                    } else if (playerPieces[1].selected) {
                        let piecesToBuff = playerPieces[1].buffAttack();
                        if (piecesToBuff.length > 0) {
                            piecesToBuff.forEach(b => {
                                let ve;
                                b.boardPosition == playerPieces[1].boardPosition ? ve = 5 : ve = 10;
                                specialUI.push({ t: 'a', v: ve, l: b, y: b.y })
                            });
                        };
                        playerPieces[1].playSpecial = 1;
                        lock = false;
                    };
                    clearSelection();
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
                    if (e.key.toLowerCase() == 'z') {
                        let s = playerPieces[findSelectedIndex];

                        if (s.attackPiece()) {
                            playerPieces[findSelectedIndex].attackingY = 1
                            playerPieces[findSelectedIndex].attackingX = 1

                            lock = false
                            endMoves();
                        };
                        clearSelection();
                    };
                };
            };

            if (e.key == 'Escape') {
                clearSelection();
                changeTransitionTo(-1);
                changePauseSelection(3);
            }
        } else if (gamePhase == 4) {
            if (e.key == 'ArrowUp') {
                changeEndSelection();
            } else if (e.key == 'ArrowDown') {
                changeEndSelection();
            }
            if (e.key == 'z') {
                setupGame();
                changeTransitionTo(changeEndSelection(1));
            };
        };
    };
});

function clearSelection() {
    playerPieces.forEach(s => {
        s.selected = 0;
        availableMoves = [];
    });
};

function step(timestamp) {
    window.requestAnimationFrame(step);
    start ? 0 : start = timestamp;
    const elapsed = timestamp - start;
    time = elapsed / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gamePhase == 0) {// Title Screen
        drawTitlePage();
    } else if (gamePhase == 2.1) {// Help Page 1
        drawHelpPlayer();
    } else if (gamePhase == 2.2) {// Help Page 2
        drawHelpEnemy();
    } else if (gamePhase == 3 || gamePhase == -1 || gamePhase == 4) {// In game
        drawBoard();
        if (isGameOver() && gamePhase == 3) { changeTransitionTo(4) };
        allPiece = [...availableMoves, ...playerPieces, queenPiece].sort(function (a, b) { return a.y - b.y });
        allPiece.forEach(e => { e.draw() });
        if (playerPieces.length > 0 && queenPiece) { drawInformationSection() }
        if (playerTurn == 0 && time > 0.25) {
            playerPieces.forEach(c => {
                if (c.cursed > 0 && c.hpAnimate > 0 && specialUI.length == 0 && !doneCurse) {
                    let v = c.cursed * 5;
                    specialUI.push({ t: 'd', v: v, l: c, y: c.y })
                    specialAnimation = 1;
                };
            });
            doneCurse = 1;
            queenPiece.moveQueen();
            moveToo = undefined;
        };
        
        if (specialAnimation && specialUI.length > 0) {
            specialUI.forEach(u => {
                let xPos = 130 + (50 * (u.l.boardPosition % 7));
                let yPos = 180 + (40 * (FLOOR(u.l.boardPosition / 7)));
                if (u.t == 'c') {
                    u.s += 10;
                    u.o -= 0.03;

                    drawText('☠️', xPos + 25, yPos, u.s, `rgba(0,0,0,${u.o})`);
                    drawText('CURSED', xPos + 25, yPos + 60, u.s, `rgba(225,0,0,${u.o + 0.2})`);
                    if (u.o <= 0) {
                        specialUI = [];
                        u.l.cursed++;
                        specialAnimation = 0;
                        endMoves();
                    };
                } else if (u.t == 'h') {
                    u.y--;
                    drawText(`❤️+${u.v}`, xPos + 25, u.y, 25, `green`);
                    if (u.y == yPos - 15) { u.l.hpAnimate += u.v }
                    if (u.y < yPos - 30) {

                        specialUI = [];
                        specialAnimation = 0;
                        endMoves();
                    };
                } else if (u.t == 'd') {
                    u.y--;
                    drawText(`❤️-${u.v}`, xPos + 25, u.y, 25, `red`);
                    if (u.y == yPos - 5) { u.l.hpAnimate -= u.v }
                    if (u.y < yPos - 30) {
                        specialAnimation = 0;

                        specialUI = [];
                        endMoves();
                    };
                } else if (u.t == 'a') {
                    u.y--;
                    drawText(`⚔️+${u.v}`, xPos + 25, u.y, 30, `white`);

                    if (u.y == yPos - 15) { u.l.attack += u.v }
                    if (u.y <= yPos - 30) {
                        specialUI = [];
                        specialAnimation = 0;
                        endMoves();
                    };
                } else if (u.t == '-c') {
                    u.y--;
                    drawText(`☠️-${u.v}`, xPos + 25, u.y, 25, `green`);
                    if (u.y == yPos - 15) { u.l.cursed -= u.v }
                    if (u.y < yPos - 30) {
                        specialUI = [];
                        specialAnimation = 0;
                        endMoves();
                    };
                };
            });
        };
        if (gamePhase == 4) {
            endScreen(queenPiece.hpAnimate, isTransioning);
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
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 7;
        ctx.arc(infoX, boardY + cellSize * 7 - 10, 20, 0, 2 * PI);
        ctx.stroke();
        playerPieces[i].selected ? ctx.fillStyle = "goldenrod" : ctx.fillStyle = "black"
        ctx.fill();

        if (playerPieces[i].currentHP / playerPieces[i].maxHP > 0.5) {
            ctx.fillStyle = "green"
        } else if (playerPieces[i].currentHP / playerPieces[i].maxHP > 0.2) {
            ctx.fillStyle = "goldenrod"
        } else {
            ctx.fillStyle = "red"
        }
        ctx.fillRect(playerPieces[i].x - 5, playerPieces[i].y - 10, 50 * (playerPieces[i].currentHP / playerPieces[i].maxHP), 5)

        playerPieces[i].draw(infoX - 10, boardY + cellSize * 7 - 25, dx, dx * 1.5, 1);
    };

    ctx.fillStyle = "black";
    ctx.fillRect(boardX, boardY - cellSize * 2, 350, 50);

    ctx.fillStyle = "grey"
    ctx.fillRect(boardX, boardY - cellSize * 2, 350, 20);


    if (queenPiece.currentHP / queenPiece.maxHP > 0.5) {
        ctx.fillStyle = "darkgreen"
    } else if (queenPiece.currentHP / queenPiece.maxHP > 0.2) {
        ctx.fillStyle = "goldenrod"
    } else {
        ctx.fillStyle = "red"
    }
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
    ctx.filter = 'sepia(100%) brightness(100%)';
    ctx.drawImage(queenImg, boardX - 25, boardY - 130);
    ctx.restore();
};
function findBestMove(MMBoard, depth, maximisingPlayer) {};
function movePiece(v, c) {
    let s = playerPieces[c];
    let ind = allPiece.findIndex(i => i.boardPosition == s.boardPosition + v.p);
    let isAlive;
    if (ind == -1 || allPiece[ind].animateHP > 0) {
        isAlive = 1
    }
    if (availableMoves.findIndex(i => i.position == s.boardPosition + v.p) >= 0 &&
        ind == -1 && isAlive) {
        s.dy = v.y;
        s.dx = v.x;
        s.selected = 0;
        s.boardPosition += v.p;
        lock = false;
        endMoves();
    };
    clearSelection();
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

export function isGameOver() {
    let queenHealth = queenPiece.hpAnimate;
    let sumOfAllPlayerHealth = 0;
    playerPieces.forEach(h => {
        sumOfAllPlayerHealth += h.hpAnimate;
    })

    if (queenHealth == 0 || sumOfAllPlayerHealth == 0) {
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
    drawTextWithShadow(TITLE, canvas.width / 2, 250, 90);
    let leftButtonX = 200;
    let leftButtonY = 475;
    drawImage(arrowImg, leftButtonX, leftButtonY, 180);
    drawImage(arrowImg, leftButtonX + 24, leftButtonY);
    drawTextWithShadow("SELECT", leftButtonX + 25, leftButtonY + 35, 25, "white");


    drawImage(zImg, leftButtonX + 150, leftButtonY, 180);
    drawTextWithShadow("confirm", leftButtonX + 165, leftButtonY + 35, 25, "white");
    if (selectedOption == 3) {
        drawTextWithShadow("PLAY", canvas.width / 2, 345, 70, "yellow");
        drawTextWithShadow("HELP", canvas.width / 2, 405, 50, "white");
    } else {
        drawTextWithShadow("PLAY", canvas.width / 2, 345, 70, "white");
        drawTextWithShadow("HELP", canvas.width / 2, 405, 50, "yellow");
    }
};

export function drawImage(src, x, y, deg = 0) {
    ctx.save();
    ctx.translate(x + src.width / 2, y + src.width / 2);
    ctx.rotate(rads(deg))
    ctx.translate(-x - src.width / 2, -y - src.width / 2);
    ctx.drawImage(src, x, y)
    ctx.restore();
}

// Transitions

export function screenFade() {
    if (isTransioning) {
        if ((gamePhase == 3 && transitionTo == -1)|| transitionTo == 4) {
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
    } else { fade(alpha) }
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
step();