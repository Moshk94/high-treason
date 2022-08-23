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