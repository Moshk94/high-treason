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
let damgeInfo = [];
let diagonals = [-8, -6, +6, +8];
let straights = [-7, - 1, 1, 7];

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
    dealDamage(x, t) {
        if (t !== undefined) {

            if (this.currentHP == this.maxHP && x > 0) {
                x = 0
            } else if (this.newHP > this.maxHP) {
                x = Math.abs(this.maxHP - this.newHP)
            }
        }

        if (this.currentHP == this.maxHP && x > 0) {
            x = 0
        } else if (this.newHP > this.maxHP) {
            x = Math.abs(this.maxHP - this.newHP)
        }

        damgeInfo.push({
            text: x,
            x: this.x,
            y: this.y,
            yOrigin: this.y,
            type: t
        });
    };

    buffAttack() {
        if (this.constructor.name == "Queen") {
            this.attack += 10;
        } else {

            let legalPositions = diagonals.map(i => this.position + i);
            legalPositions.forEach(e => {
                let conditionTest = pawnArray.findIndex(a => a.position === e)
                if (conditionTest >= 0) {

                    pawnArray[conditionTest].attack += 10
                    pawnArray[conditionTest].dealDamage(10)

                };
            });
        };
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
    constructor(position, owner, keycode) {
        super();
        this.position = position;
        this.owner = owner;
        this.keycode = keycode
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
    constructor(position, type, attack, keycode) {
        super();
        this.type = type;
        this.position = position;
        this.x = 130 + (this.getBoardCoords(position).x * 50);
        this.y = 180 + (50 * 0.8 * this.getBoardCoords(position).y);
        this.currentHP = 1;
        this.maxHP = 100;
        this.attack = attack;
        this.newHP = this.maxHP;
        this.keycode = keycode
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
    heal() {
        let count = 1;
        let legalPositions = diagonals.map(i => this.position + i);
        let piecesToHeal = [];
        let healValue = 20;
        legalPositions.forEach(e => {
            let conditionTest = pawnArray.findIndex(a => a.position === e && a.currentHP != a.maxHP)
            if (conditionTest >= 0) {
                count++;
                piecesToHeal.push(conditionTest);
                healValue /= 2;
            }
        });

        piecesToHeal.forEach(i => {
            pawnArray[i].newHP += healValue;
            pawnArray[i].dealDamage(healValue, 'h');
        });

        this.newHP += healValue;
        this.dealDamage(healValue, 'h');
    }
    attackPiece() {
        let legalPositions = diagonals.map(i => this.position + i);
        if (legalPositions.includes(queenPiece.position) && ghostArray[0].owner == this.type) {
            queenPiece.newHP -= (this.attack);
            queenPiece.dealDamage(-this.attack, 'a');
        };
    };
    findLegalMoves() {
        // TODO: Refactor code
        let checkNorth = pawnArray.some(el => el.position === this.position - 7) || this.position - 7 == queenPiece.position;
        let checkSouth = pawnArray.some(el => el.position === this.position + 7) || this.position + 7 == queenPiece.position;
        let checkWest = pawnArray.some(el => el.position === this.position - 1) || this.position - 1 == queenPiece.position;
        let checkEast = pawnArray.some(el => el.position === this.position + 1) || this.position + 1 == queenPiece.position;

        if (this.position - 7 > 0 && !checkNorth) {
            ghostArray.push(new Moves(this.position - 7, this.type, 38));
        };

        if (this.position + (7 * 1) <= 49 && !checkSouth) {
            ghostArray.push(new Moves(this.position + 7, this.type, 40));
        };

        if (Math.ceil(this.position / 7) == Math.ceil((this.position - 1) / 7) && !checkWest) {
            ghostArray.push(new Moves(this.position - 1, this.type, 37));
        };

        if (Math.ceil(this.position / 7) == Math.ceil((this.position + 1) / 7) && !checkEast) {
            ghostArray.push(new Moves(this.position + 1, this.type, 39));
        };
    };
};

let queenPiece = new Queen(4);
let ghostArray = [];
export let pawnArray = [
    new Pawn(40, 50, 10, 49),
    new Pawn(48, -60, 10, 51),
    new Pawn(46, 0, 20, 50),
];

canvas.addEventListener('keydown', function (e) {
    console.log(e.keyCode)
    if (ghostArray.length > 0) {
        if (e.keyCode == 88 && ghostArray[0].owner == 50) {
            pawnArray[0].heal();
        };
        pawnArray.forEach(f => {
            if (e.keyCode == 90) {
                f.attackPiece();
            };
        });
        if (e.keyCode == 88 && ghostArray[0].owner == -60) {
            pawnArray[1].buffAttack();
        };
    }

    ghostArray.forEach(f => {
        if (e.keyCode == f.keycode) {
            f.click();
        }
    });
    ghostArray = [];
    pawnArray.forEach(f => {
        f.selected = 0
        if (e.keyCode == f.keycode) {
            f.selected = 1
            f.findLegalMoves();
        }
    })
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
    drawInformationSection();
    drawBoard();
    allPiece = [...ghostArray, ...pawnArray, queenPiece].sort(function (a, b) { return a.position - b.position });
    allPiece.forEach(e => {
        e.draw()
    });

    if (damgeInfo.length > 0) {
        damgeInfo.forEach(e => {
            let c;
            let sign = '';
            if (e.type == 'a') {
                if (e.text >= 0) {
                    c = 'green'
                    sign += '+'
                } else {
                    c = 'red'
                    sign += '-'
                }
            } else if (e.type == 'h') {
                if (e.text >= 0) {
                    c = 'green'
                    sign += '+'
                } else {
                    c = 'red'
                    sign += '-'
                }
            } else {
                sign +='A: +'
                c = 'orange'
            }
            drawText(sign + Math.abs(e.text), e.x + 50, e.y--, 40, c)
            if (e.y < e.yOrigin - 25) {
                damgeInfo = [];
            };
        });
    };

}, 1 / 60);

