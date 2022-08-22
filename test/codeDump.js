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
};

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