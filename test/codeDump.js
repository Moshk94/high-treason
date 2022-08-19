// CODE DUMP: May or may not be useful

class Pawn extends Piece {
    constructor(p, o) {
        super(p, o);
        this.attack = 0;
        this.defense = 0;
        this.id = `p${p}`
        this.svg = `M312.07 194.46A56.07 56.07 0 1 1 256 138.39a56.07 56.07 0 0 1 56.07 56.07zM406 418.01H106v60h300v-60zM282.33 261.52a71.81 71.81 0 0 1-52.15.2c-.73 58.91-62.35 114.06-96.75 140.28H378.9c-34.09-26.33-95.44-81.78-96.57-140.48z`
    };
    availableMoves() {
        const m = [this.pos - 6, this.pos + 6, this.pos - 8, this.pos + 8, this.pos - 1, this.pos + 1, this.pos - 7, this.pos + 7,];
        let legalMoves = [];
        m.forEach(e => {
            if (inRange(e) && (columnNumber(e) < columnNumber(this.pos) + 3) && (columnNumber(e) > columnNumber(this.pos) - 3)) {
                let gg = arr.findIndex(el => el.pos === e);
                if (gg != -1 && (arr[gg].owner != this.owner)) {
                    if ((arr[gg].pos === m[0]) || arr[gg].pos === m[1] || arr[gg].pos === m[2] || arr[gg].pos === m[3]) { legalMoves.push(e) }
                }
                if (gg == -1) { legalMoves.push(e) }
            };
        });
        return legalMoves;
    };
};



ctx.save();
ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(2deg)';
ctx.drawImage(queenImage, canvas.width / 2 - 10, 50)
ctx.restore();

ctx.save();
ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(300deg)';
ctx.drawImage(pawnImg, canvas.width / 2 - 56, canvas.height / 2 - 50)
ctx.restore();
ctx.drawImage(pawnImg, canvas.width / 2 + 56, canvas.height / 2 - 50)



class Piece {
    constructor(p, o) {
        this.hp = 100;
        this.maxHP = 100
        // this.attack
        this.pos = p;
        this.owner = o;
    };
    score() { return `TODO: Rebuild Score function` };
};

class Pawn extends Piece {
    constructor(p, o) {
        super(p, o);
        this.attack = 100;
        this.id = `p${p}`
        this.x = canvas.width / 2
        this.y = canvas.height / 2
    };
    draw(){
        ctx.save();
        ctx.filter = 'sepia(100%) saturate(500%) hue-rotate(90deg)';
        ctx.drawImage(pawnImg, this.x, this.y);
        ctx.restore();
    }
};