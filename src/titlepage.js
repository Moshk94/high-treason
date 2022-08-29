import { ctx } from "./core";
import { drawTextWithShadow } from "./helperFunctions";

const TITLE = 'HIGH TREASON';
let selectedOption = 3;
export function changeSelection(x) {
    if(x == undefined){
        return selectedOption
    } else {
        selectedOption = x;
    };
};

export function drawTitlePage() {
    ctx.beginPath();
    ctx.fillStyle = '#265b5f';
    ctx.fillRect(50, 250, canvas.width - 110, 310);
    ctx.closePath();
    drawTextWithShadow(TITLE, canvas.width / 2, 310, 90);
    if (selectedOption == 3) {
        drawTextWithShadow("PLAY", canvas.width / 2, 405, 70, "yellow");
        drawTextWithShadow("HELP", canvas.width / 2, 465, 50, "white");
    } else {
        drawTextWithShadow("PLAY", canvas.width / 2, 405, 70, "white");
        drawTextWithShadow("HELP", canvas.width / 2, 465, 50, "yellow");
    }
};