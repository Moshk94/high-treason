import { ctx } from "./core";
import { pauseScreen } from "./pauseScreen";
import { resetGame } from "./core";
export let gamePhase = -1;
const transitionSpeed = 0.06;
let isTransioning = 0;
let alpha = 0;
let transitionTo;

export function screenFade() {
    if (isTransioning) {
        if (gamePhase == 3 && transitionTo == -1) {
            if (alpha < 0.8) {
                alpha += transitionSpeed;
            } else {
                gamePhase = transitionTo;
                isTransioning = 0;
            }
        } else if (gamePhase == -1 && transitionTo == 3) {
            if (alpha > 0) {
                alpha -= transitionSpeed;
            } else {
                gamePhase = transitionTo;
                isTransioning = 0;
            }
        } else {
            if (alpha <= 2) {
                alpha += transitionSpeed;
            } else if (alpha > 2) {
                gamePhase = transitionTo;
                isTransioning = 0;
            };
        }
    } if (!isTransioning) {
        if (gamePhase != -1) {
            if (alpha >= 0) {
                alpha -= (0.06);
                transitionTo = undefined;
            };
        };
    };

    if (gamePhase == -1) {
        if (transitionTo == 0) {
            pauseScreen();
            fade(alpha)
        } else {
            fade(alpha);
            pauseScreen();
        }
    } else {

        fade(alpha);
    }

    if(gamePhase == 0 || gamePhase == 2.1 || gamePhase == 2.2){
        if(transitionTo == 3){
            resetGame();
        };
    };
};

export function changeTransitionTo(x) {
    transitionTo = x;
    isTransioning = 1;
};

function fade(ap) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(0, 0, 0, ${ap})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
}