import { drawText } from "./helperFunctions";
import { drawTextWithShadow } from "./helperFunctions";
import {ctx} from "./core"

let selectedEndOption = 3;
export function changeEndSelection(x) {
    if (x) {
        return selectedEndOption
    } else {
        if (selectedEndOption == 3) {
            selectedEndOption = 0
        } else if (selectedEndOption == 0) {
            selectedEndOption = 3
        };
    };
};

export function endScreen(z) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
    let c;
    let t;
    if(z <= 0){
        c = 'green'
        t = 'you win!'
    } else {
        c = 'red'
        t = 'Game over'
    }

    
    drawText(t, canvas.width / 2, 250, 100, c);
    drawText('Thanks for playing!', canvas.width / 2, 300, 25, 'white');
    if (selectedEndOption == 3) {
        drawTextWithShadow("Play Again?", canvas.width / 2, 400, 50, "yellow");
        drawTextWithShadow("QUIT", canvas.width / 2, 460, 50, "white");
    } else {
        drawTextWithShadow("Play Again?", canvas.width / 2, 400, 50, "white");
        drawTextWithShadow("QUIT", canvas.width / 2, 460, 50, "yellow");
    };
};
