import { ctx } from "./core";
import { drawTextWithShadow } from "./helperFunctions";

const TITLE = 'HIGH TREASON';

export function drawTitlePage() {
    ctx.beginPath();
    ctx.fillStyle = '#265b5f';
    ctx.fillRect(50, 250, ctx.measureText(TITLE).width * 1.7, 310);
    ctx.closePath();
    drawTextWithShadow(TITLE, canvas.width / 2, 310, 90);

    drawTextWithShadow("PLAY", canvas.width / 2, 420, 70, "yellow");
};