/* INFO: Damage text and Animation

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
};

if (damgeInfo != undefined) {
    let c;
    damgeInfo.text > 0 ? c = 'red' : c = 'green';

    drawText(Math.abs(damgeInfo.text), damgeInfo.x, damgeInfo.y--, 50, c)
    if (damgeInfo.y < damgeInfo.yOrigin - 25) {
        damgeInfo = undefined
    };
};

*/


/* INFO: Old mouse up code

canvas.addEventListener('mouseup', function (e) {
    ghostArray.forEach(e => {
        if (e.isWithinBounds()) {
            e.click();
        }
    });

    queenArray.click();
    ghostArray = [];

    selectedPiece = undefined;

    pawnArray.forEach(e => {
        e.selected = 0;
        e.click();
        if (!e.isWithinBounds()) {
            e.selected = 0;
        };

        if (e.selected) {
            ghostArray = [];
            selectedPiece = undefined;
            e.findLegalMoves();
        };
    })
}, false);

*/


/* INFO: Old mouse move code

canvas.addEventListener('mousemove', function (e) {
    let r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left
    mouseY = e.clientY - r.top
}, false);

*/


/* INFO: Old within bounds code

let mouseX;
let mouseY;

isWithinBounds() {
    if (mouseX > this.x && mouseX < this.x + pawnImg.width &&
        mouseY > this.y && mouseY < this.y + pawnImg.height) {
        return true
    };
};

*/