import { drawText } from "./helperFunctions";
import {changeTransitionTo} from "./transitions"
const TITLE = 'TREASON'

export function drawTitlePage(x, y) {
    drawText(TITLE, canvas.width / 2, 310, 120, 'black');
    drawText(TITLE, canvas.width / 2, 300, 120);

    drawText("PLAY", canvas.width / 2, 420, 75, 'black');
    drawText("HELP", canvas.width / 2, 495, 50, 'black');

    handleTitleMouseEvents(x, y);
};

export function handleTitleMouseEvents(x, y, e) {
    if (x > canvas.width / 2 - 74 && x < canvas.width / 2 + 66
        && y > 396 && y < 446) {
            if (e != undefined) {
                changeTransitionTo(3);
            };
        drawText("PLAY", canvas.width / 2, 415, 75, 'white');
    } else {
        drawText("PLAY", canvas.width / 2, 415, 75);
    };
    if (x > canvas.width / 2 - 49 && x < canvas.width / 2 + 43
        && y > 478 && y < 513) {
            if (e != undefined) {
                changeTransitionTo(2.1);
            };
        drawText("HELP", canvas.width / 2, 490, 50, 'white');
    } else {
        drawText("HELP", canvas.width / 2, 490, 50);
    };
};