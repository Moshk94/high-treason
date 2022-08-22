import { ctx, mouseX, mouseY } from "./core";
import { changeTransitionTo, gamePhase } from "./transitions"

export class DrawTextWithLink {
    constructor(txt, x, y, fontsize, c, page, pageTo, s = 0) {
        this.txt = txt;
        this.x = x;
        this.y = y;
        this.page = page;
        this.pageTo = pageTo;
        this.fontsize = fontsize;
        this.color = c;
        this.shadow = s
    }
    draw() {
        if (this.page.indexOf(gamePhase) !== -1) {
            ctx.font = `${this.fontsize}px p`;

            let a = ctx.measureText(this.txt);
            this.top = this.y - this.fontsize / 2 * 0.5;
            this.right = a.width;
            this.bottom = this.fontsize * 0.6;
            this.left = this.x - this.right / 2 * 1.04;

            if (this.isWithinBounds()) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = this.color;
            }

            if (this.shadow) {
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = "black";
                ctx.fillText(this.txt, this.x, this.y + this.fontsize / 10);
                ctx.restore();
            };

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.txt, this.x, this.y);
            ctx.restore();
        };
    };
    click() {
        if (this.isWithinBounds() && this.page.indexOf(gamePhase) !== -1) {
            changeTransitionTo(this.pageTo)
        }

    }
    isWithinBounds() {
        if (mouseX > this.left && mouseX < this.right + this.left &&
            mouseY > this.top && mouseY < this.bottom + this.top) {
            return true
        }
    };
};