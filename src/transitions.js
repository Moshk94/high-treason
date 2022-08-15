import { ctx } from "./constants";

export let gamePhase = 0;
const transitionSpeed = 0.1;
let isTransioning = 0;
let alpha = 0;
let transitionTo;

export function screenFade(){
    if (isTransioning) {
        if (alpha <= 1) {

            alpha += transitionSpeed;
        } else if (alpha > 1) {
            gamePhase = transitionTo
            isTransioning = 0
        }

    } if (!isTransioning) {
        if (alpha >= 0) {
            alpha -= transitionSpeed + 0.2;
            transitionTo = undefined;
        }
    };

    ctx.beginPath();
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.closePath();
};

export function changeTransitionTo(x){
    transitionTo = x;
    isTransioning = 1;
}