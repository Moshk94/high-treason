import { drawText, drawTextWithShadow } from "./helperFunctions";

let selectedPausedOption = 3;
export function changePauseSelection(x) {
    if (x == undefined) {
        return selectedPausedOption
    } else {
        selectedPausedOption = x;
    };
};

export function pauseScreen() {
    drawText("PAUSED", canvas.width / 2, 250, 100, 'white');
    if (selectedPausedOption == 3) {
        drawTextWithShadow("RESUME", canvas.width / 2, 350, 50, "yellow");
        drawTextWithShadow("QUIT", canvas.width / 2, 410, 50, "white");
    } else {
        drawTextWithShadow("RESUME", canvas.width / 2, 350, 50, "white");
        drawTextWithShadow("QUIT", canvas.width / 2, 410, 50, "yellow");
    };
};
