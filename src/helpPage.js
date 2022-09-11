import { drawText } from "./helperFunctions";
import { ctx, pawnImg, xkeyImg,zImg, arrowImg, drawImage, onekeyImg, twokeyImg, threekeyImg } from "./core";
import { drawTextWithShadow } from "./helperFunctions";
export function drawHelpPlayer() {
    let pieceX = 100
    drawText("PAWNS", canvas.width / 2, 170, 100, 'black');
    drawText("PAWNS", canvas.width / 2, 165, 100, 'white');

    let leftButtonX2 = canvas.width / 2 - 160
    let leftButtonY2 = 230

    drawImage(onekeyImg, leftButtonX2, leftButtonY2);
    drawImage(twokeyImg, leftButtonX2 + 20, leftButtonY2);
    drawImage(threekeyImg, leftButtonX2 + 42, leftButtonY2);
    drawText("select piece", leftButtonX2 + 35, leftButtonY2 + 35, 20, 'white');

    drawImage(zImg, leftButtonX2 + 157, leftButtonY2, 180);
    drawText("attack", leftButtonX2 + 170, leftButtonY2 + 35, 20, 'white');

    drawImage(xkeyImg, leftButtonX2 + 285, leftButtonY2, 180);
    drawText("special", leftButtonX2 + 300, leftButtonY2 + 35, 20, 'white');

    ctx.save();
    ctx.filter = 'brightness(75%) hue-rotate(180deg)';
    ctx.drawImage(pawnImg, pieceX, 280 - pawnImg.height / 2 + 50);
    ctx.restore();
    drawText("NO specials - STARTS WITH 20 ATTACK", canvas.width / 2 + pieceX / 3, 280 + 50, 20, 'white');

    ctx.save();
    ctx.filter = 'brightness(75%) hue-rotate(120deg)';
    ctx.drawImage(pawnImg, pieceX, 350 - pawnImg.height / 2 + 50);
    ctx.restore();
    drawText("CAN REMOVE CURSES AND HEAL OTHER PIECES", canvas.width / 2 + pieceX / 2, 345 + 50, 20, 'white');
    drawText("WITHIN A 2 TILE RANGE", canvas.width / 2 - 34, 360 + 50, 20, 'white');

    ctx.save();
    ctx.filter = 'brightness(75%) hue-rotate(0deg)';
    ctx.drawImage(pawnImg, pieceX, 420 - pawnImg.height / 2 + 50);
    ctx.restore();
    drawText("CAN INCREASE PIECE ATTACK", canvas.width / 2 - pieceX / 5, 420 + 50, 20, 'white');

    let leftButtonY = 525;
    drawImage(zImg, canvas.width / 2, leftButtonY, 180);
    drawTextWithShadow("play", canvas.width / 2 + 12, leftButtonY + 35, 25, "yellow");

    drawImage(arrowImg, canvas.width / 2 + 150, leftButtonY, 90);
    drawTextWithShadow("next", canvas.width / 2 + 163, leftButtonY + 35, 25, "yellow");

};

export function drawHelpEnemy() {
    drawText("QUEEN", canvas.width / 2, 170, 100, 'black');
    drawText("QUEEN", canvas.width / 2, 165, 100, 'white');

    drawText("KILL THE EVIL QUEEN PIECE!", canvas.width / 2, 225, 25, 'yellow');

    drawText("THE QUEEN HAS AN ATTACK RANGE OF 1 SQUARE", canvas.width / 2, 250, 20, 'white');

    drawText("SPECIAL ATTACKS (UNLIMITED RANGED):", canvas.width / 2, 300, 20, 'white');

    drawText("INCREASE ATTACK", canvas.width / 2, 350, 22, 'white');

    drawText("APPLIES DAMAGE OVER TIME TO PIECES", canvas.width / 2, 375, 22, 'white');
    drawText("INCREASES DAMAGE OVER TIME IF ALREADY CURSED", canvas.width / 2, 390, 22, 'white');

    drawText("RESTORES SOME HEALTH", canvas.width / 2, 440, 22, 'white');

    let leftButtonY = 475;
    drawImage(zImg, canvas.width / 2, leftButtonY, 180);
    drawTextWithShadow("play", canvas.width / 2 + 12, leftButtonY + 35, 25, "yellow");

    drawImage(arrowImg, canvas.width / 2 - 150, leftButtonY, -90);
    drawTextWithShadow("Prev", canvas.width / 2 - 137, leftButtonY + 35, 25, "yellow");
};
