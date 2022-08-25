import { ctx } from "./core";
import { drawText } from "./helperFunctions";
const TITLE = 'TREASON'

// TODO: Reduce the box size so it doesn't span the width of the canvas/
// 
export function drawTitlePage() {
    ctx.beginPath();
    ctx.fillStyle = '#265b5f';
    ctx.fillRect(0, 250, canvas.width, 310);
    ctx.closePath();
    drawText(TITLE, canvas.width / 2, 310, 120, 'black');
    drawText(TITLE, canvas.width / 2, 300, 120, 'white');
};