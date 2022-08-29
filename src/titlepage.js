import { ctx } from "./core";
import { drawText } from "./helperFunctions";
const TITLE = 'HIGH TREASON'

// TODO: Reduce the box size so it doesn't span the width of the canvas/
// 
export function drawTitlePage() {
    ctx.beginPath();
    ctx.fillStyle = '#265b5f';
    ctx.fillRect(50, 250, ctx.measureText(TITLE).width * 1.75, 310);
    ctx.closePath();
    drawText(TITLE, canvas.width / 2, 310, 80, 'black');
    drawText(TITLE, canvas.width / 2, 300, 80, 'white');
};