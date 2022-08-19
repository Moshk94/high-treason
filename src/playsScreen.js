import { drawText } from "./helperFunctions";
import { changeTransitionTo } from "./transitions";
export function pauseScreen(x, y, e) {

    drawText("PAUSED", canvas.width / 2, 250, 100, 'white');
    if (x > canvas.width / 2 - 76 && x < canvas.width / 2 + 69 &&
        y > 335 && y < 370) {
        if (e != undefined) {
            changeTransitionTo(3);
        } else {

            drawText("RESUME", canvas.width / 2, 350, 50, 'yellow');
        }
    } else {
        drawText("RESUME", canvas.width / 2, 350, 50, 'white');
    }

    if (x > canvas.width / 2 - 49 && x < canvas.width / 2 + 43 &&
        y > 395 && y < 395 + 35) {

        if (e != undefined) {
            changeTransitionTo(0);
        } else {
            drawText("QUIT", canvas.width / 2, 410, 50, 'yellow');
        }
    } else {
        drawText("QUIT", canvas.width / 2, 410, 50, 'white');
    }
}