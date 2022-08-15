import { ctx, title } from "./constants";

let titleYpos = -50;
let playXPos = -50
let helpXPos = canvas.width + 50

export function animateTitle() {
    if (titleYpos < 250) {
        titleYpos += 20;
    };
    const textWidth = 164

    ctx.beginPath();
    ctx.font = '75px serif';
    ctx.fillStyle = "black";
    ctx.fillText(title, canvas.width / 2 - textWidth, titleYpos + 10);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "goldenrod";
    ctx.fillText(title, canvas.width / 2 - textWidth, titleYpos);
    ctx.closePath();
};

export function animatePlayButton() {
    if (playXPos < (canvas.width / 2 - 80)) {
        playXPos += 15;
    };
    ctx.beginPath();
    ctx.font = '75px serif';
    ctx.fillStyle = "black";
    ctx.fillText('PLAY', playXPos, 450);
    ctx.closePath();
}

export function animateH2PButton() {
    if (helpXPos > (canvas.width / 2 - 50)) {
        helpXPos -= 20;
    };

    ctx.beginPath();
    ctx.font = '50px serif';
    ctx.fillStyle = "black";
    ctx.fillText("HELP", helpXPos, 550);
    ctx.closePath();
}