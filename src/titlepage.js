import { ctx, title } from "./constants";

let titleYpos = -10;

export function animateTitle() {
    if (titleYpos < 250) {
        titleYpos += 10;
    };
    const text = ctx.measureText(title);
    
    ctx.beginPath();
    ctx.font = '75px serif';
    ctx.fillStyle = "black";
    ctx.fillText(title, canvas.width / 2 - text.width / 2, titleYpos + 10);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "goldenrod";
    ctx.fillText(title, canvas.width / 2 - text.width / 2, titleYpos);
    ctx.closePath();
};
