// CODE DUMP: May or may not be useful

let damgeInfo;
dealDamage(x) {
    if (this.selected) {
        damgeInfo = {
            text: x,
            x: this.x,
            y: this.y,
            yOrigin: this.y
        };
    }
}

if (damgeInfo != undefined) {
    let c;
    damgeInfo.text > 0 ? c = 'red' : c = 'green';

    drawText(Math.abs(damgeInfo.text), damgeInfo.x, damgeInfo.y--, 50, c)
    if (damgeInfo.y < damgeInfo.yOrigin - 25) {
        damgeInfo = undefined
    };
};

ctx.save();
ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(2deg)';
ctx.drawImage(queenImage, canvas.width / 2 - 10, 50)
ctx.restore();


// Really old!

const c = document.getElementById('canvas');
const ctx = c.getContext("2d");
const PI = Math.PI
const pawnImg = new Image();
const targetImg = new Image();

pawnImg.src = 'p.png';
targetImg.src = 't.png';

let newPosition;


let mouseX;
let mouseY;
let boardWidth = 460;
let boardX = canvas.width / 2 - boardWidth / 2;
let boardY = 175;
let delta = boardWidth / 7;
let allPiece
export function drawText(text, centerX, centerY, fontsize, color = '#333') {
    ctx.save();
    ctx.font = `${fontsize}px p`
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
};

class Moves {
    constructor(position, owner) {
        this.position = position;
        this.owner = owner;
    };
    draw() {
        let phi;

        if (this.owner == 0) {
            phi = 90
        } else if (this.owner == 1) {
            phi = -60;
        } else if (this.owner == 2) {
            phi = 200
        }

        let filterString = `opacity(35%) sepia(100%) saturate(500%) hue-rotate(${phi}deg)`;

        this.y = Math.floor(boardY + ((this.getCords().y - 1) * delta * 0.8) - delta / 2)

        this.x =  Math.floor(boardX + 9 + delta * this.getCords().x)


        ctx.save();
        ctx.filter = filterString;
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.restore();
    }
    getCords() {
        return {
            x: (this.position - 1) % 7,
            y: Math.ceil(this.position / 7),
        }
    }
    click() {
        piecesArray.forEach(e => {
            if (e.n == this.owner) {
                newPosition = {
                    np: this.position,
                    o: this.owner
                }
                // moveMent = {
                //     x: this.x,
                //     y: this.y,
                //     owner: this.owner
                // }
            }
        })
    }
    isWithinBounds() {
        if (mouseX > this.x && mouseX < this.x + pawnImg.width &&
            mouseY > this.y && mouseY < this.y + pawnImg.height) {
            return true
        };
    };
}

class Pawn {
    constructor(position, n) {
        this.attack = Math.floor(Math.random() * 50) + 1;;
        this.n = n;
        this.position = position;
        this.currentHP = Math.floor(Math.random() * 100) + 1;
        this.maxHP = 100;
        this.selected = 0;
        this.cursed = 0;
        this.y = Math.floor(boardY + ((this.getCords(position).y - 1) * delta * 0.8) - delta / 2)
        this.x = Math.floor(boardX + 9 + delta * this.getCords(position).x)
    };
    draw() {
        if (this.currentHP <= 0) {
            this.currentHP = 0
        } else if (this.currentHP >= this.maxHP) {
            this.currentHP = this.maxHP;
        }

        let phi

        if (this.n == 0) {
            phi = 90
        } else if (this.n == 1) {
            phi = -60;
        } else if (this.n == 2) {
            phi = 200
        }

        let filterString = `sepia(100%) saturate(500%) hue-rotate(${phi}deg)`;

        let x = boardX - 15 + this.n * 187;
        let y = 580;
        let hpPercent = this.currentHP / this.maxHP;
        let circleY = y + 14;
        
        if (newPosition != undefined && newPosition.o == this.n) {
            let newX = Math.floor(boardX + 9 + delta * this.getCords(newPosition.o).x)
            let newY = Math.floor(boardY + ((this.getCords(newPosition.o).y - 1) * delta * 0.8) - delta / 2)
            let moveSpeed = 10
            console.log(newX)
            console.log(this.x)

            if(newX != this.x){
                if(newX > this.x){
                    this.x += moveSpeed
                } else {

                    this.x -= moveSpeed
                }
            }
            // if(newY != this.y){
            //     if(newY > this.y){

            //         this.y += moveSpeed
            //     } else {

            //         this.y -= moveSpeed
            //     }
            // }

            if(/*this.y == newY &&*/ this.x == newX){
                this.position = newPosition.np
                newPosition = undefined
            }
        }

        ctx.fillStyle = "black"
        ctx.fillRect(x, y, 130, 75);

        ctx.fillStyle = "grey"
        ctx.fillRect(x, y, 130, 20);

        drawText(`${this.currentHP} / ${this.maxHP}`, x + 75, y + 10, 25, 'black')
        drawText(`Att: ${this.attack}`, x + 75, y + 35, 25, 'white')

        // Info Section
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.arc(x, circleY, 20, 0, 2 * PI);
        ctx.stroke();
        ctx.fillStyle = "black"
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 3;
        ctx.arc(x, circleY, 20, -PI / 2, (PI * 2) * hpPercent - PI / 2);
        ctx.stroke();

        if (this.selected) {
            filterString += 'drop-shadow(1px 1px 10px red)';
        };
        ctx.save();
        ctx.filter = filterString;
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.drawImage(pawnImg, x - 10, circleY - 15, 20, 30);
        ctx.restore();
    };
    getCords(c) {
        return {
            x: (c - 1) % 7,
            y: Math.ceil(c / 7),
        }
    }
    click() {
        if (this.isWithinBounds()) {
            piecesArray.forEach(e => {
                e.selected = 0
            })
            this.selected = 1;
        };
    };
    isWithinBounds() {
        if (mouseX > this.x && mouseX < this.x + pawnImg.width &&
            mouseY > this.y && mouseY < this.y + pawnImg.height) {
            return true
        };
    };
    findLegalMoves() {
        let checkNorth = piecesArray.some(el => el.position === this.position - 7);
        let checkSouth = piecesArray.some(el => el.position === this.position + 7);
        let checkRight = piecesArray.some(el => el.position === this.position + 1);
        let checkLeft = piecesArray.some(el => el.position === this.position - 1);
        if (this.position - 7 >= 1 && !checkNorth) {
            legalMoves.push(new Moves(this.position - 7, this.n));
        }
        if (this.position + 7 <= 49 && !checkSouth) {
            legalMoves.push(new Moves(this.position + 7, this.n));
        }
        if (Math.ceil(this.position / 7) == Math.ceil((this.position + 1) / 7) && !checkRight) {

            legalMoves.push(new Moves(this.position + 1, this.n));
        }
        if (Math.ceil(this.position / 7) == Math.ceil((this.position - 1) / 7) && !checkLeft) {

            legalMoves.push(new Moves(this.position - 1, this.n));
        };
    }
};
let legalMoves = []
let piecesArray = [
    new Pawn(24, 2),
    new Pawn(3, 1),
    new Pawn(49, 0)
];

canvas.addEventListener('mousemove', function (e) {
    let rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
}, false);

canvas.addEventListener('mouseup', function (e) {
    legalMoves.forEach(e => {
        if (e.isWithinBounds()) {
            e.click();
        }
    });

    legalMoves = [];
    piecesArray.forEach(e => {
        e.click();

        if (e.isWithinBounds() != true) {
            e.selected = 0;
        };
        if (e.selected) {
            legalMoves = [];
            e.findLegalMoves();
        }
    });
}, false);


setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    allPiece = [...legalMoves, ...piecesArray].sort(function (a, b) { return a.position - b.position });
    allPiece.forEach(e => {
        e.draw();
    });

}, 1 / 60);

function drawBoard() {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.strokeRect(boardX, boardY, boardWidth, boardWidth * 0.81);

    ctx.stroke();
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            ctx.fillStyle = (i + j) % 2 == 0 ? '#a9a9a9' : '#000000';
            ctx.fillRect(boardX + (i * delta), boardY + (j * delta * 0.8), delta, delta - 10)
        }
    }
};

// End really old