import { ctx, title } from "./constants";

export function drawTitleText() {

    ctx.beginPath();
    ctx.font = '75px serif';
    ctx.fillStyle = "black";
    ctx.fillText(title, canvas.width / 2 - ctx.measureText(title).width / 2, 250 + 10);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "goldenrod";
    ctx.fillText(title, canvas.width / 2 - ctx.measureText(title).width / 2, 250);
    ctx.closePath();
};

export function animatePlayButton() {
    ctx.beginPath();
    ctx.font = '75px serif';
    ctx.fillStyle = "black";
    ctx.fillText('PLAY', canvas.width / 2 - ctx.measureText('PLAY').width / 2, 450);
    ctx.closePath();
}

export function animateH2PButton() {
    ctx.beginPath();
    ctx.font = '50px serif';
    ctx.fillStyle = "black";
    ctx.fillText("HELP", canvas.width / 2 - ctx.measureText('HELP').width / 2, 550);
    ctx.closePath();
}