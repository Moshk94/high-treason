import { isGameOver, queenPiece } from "./core";
import { drawText, drawTextWithShadow } from "./helperFunctions";

let selectedPausedOption = 3;
export function changePauseSelection(x) {
    if(x == undefined){
        return selectedPausedOption
    } else {
        selectedPausedOption = x;
    };
};

export function pauseScreen(z) {
    console.log(z)
    if(z){
        let c;
        queenPiece.hpAnimate == 0 ? c = 'green': c = 'red';
        drawText("Game over", canvas.width / 2, 250, 100, 'white');
        drawText("Thanks for playing!", canvas.width / 2, 300, 20, c);

        if(selectedPausedOption == 3){
            drawTextWithShadow("Play Again?", canvas.width / 2, 350, 50, "yellow");
            drawTextWithShadow("QUIT", canvas.width / 2, 410, 50, "white");
        } else {
            drawTextWithShadow("Play Again?", canvas.width / 2, 350, 50, "white");
            drawTextWithShadow("QUIT", canvas.width / 2, 410, 50, "yellow");
        };
    } else{
        drawText("PAUSED", canvas.width / 2, 250, 100, 'white');
        if(selectedPausedOption == 3){
            drawTextWithShadow("RESUME", canvas.width / 2, 350, 50, "yellow");
            drawTextWithShadow("QUIT", canvas.width / 2, 410, 50, "white");
        } else {
            drawTextWithShadow("RESUME", canvas.width / 2, 350, 50, "white");
            drawTextWithShadow("QUIT", canvas.width / 2, 410, 50, "yellow");
        };
    }
};
