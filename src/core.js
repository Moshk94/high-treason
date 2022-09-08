import { drawTitlePage, changeSelection } from './titlepage.js'
import { gamePhase, screenFade } from './transitions.js'
import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { changePauseSelection } from './pauseScreen.js';
import { changeTransitionTo } from "./transitions";
import { drawBoard } from './boardUI.js';
import { rads, FLOOR } from './helperFunctions.js';

export const ctx = document.getElementById('canvas').getContext("2d");

const pawnImg = new Image();
const queenImg = new Image();

pawnImg.src = 'p.png';
queenImg.src = 'q.png';

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

let fired = false;
canvas.onkeyup = function () { fired = false };

canvas.addEventListener('keydown', function (e) {
    if (!fired) {
        fired = true;
        if (gamePhase == 0) {
            if (e.key == 'ArrowUp' || e.key == 'ArrowDown') {
                changeSelection();
            }
            if (e.key == 'z') {
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

setInterval(() => {
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
    };
    screenFade();
}, 1 / 60);