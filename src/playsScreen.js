import { drawText } from "./helperFunctions";

import { textWithLink } from "./core";
export function pauseScreen() {
    drawText("PAUSED", canvas.width / 2, 250, 100, 'white');
    textWithLink[0].draw();
    textWithLink[1].draw();
}