import { drawText } from "./helperFunctions";
import { ctx, pawnImg } from "./core";

export function drawHelpPlayer(){
    let pieceX = 100
    drawBackground();
    drawText("PAWNS", canvas.width / 2, 170, 100, 'black');
    drawText("PAWNS", canvas.width / 2, 165, 100, 'white');

    ctx.save();
    ctx.filter = 'brightness(50%) hue-rotate(180deg)';
    ctx.drawImage(pawnImg, pieceX, 280 - pawnImg.height/2);
    ctx.restore();
    drawText("NO ABILITIES - STARTS WITH 20 ATTACK", canvas.width / 2 + pieceX/3, 280, 20, 'white');
    
    ctx.save();
    ctx.filter = 'brightness(50%) hue-rotate(120deg)';
    ctx.drawImage(pawnImg, pieceX, 350 - pawnImg.height/2);
    ctx.restore();
    drawText("CAN REMOVE CURSES AND HEAL OTHER PIECES", canvas.width / 2 + pieceX/2, 345, 20, 'white');
    drawText("WITHIN A 2 TILE RANGE", canvas.width / 2 - 34, 360, 20, 'white');


    ctx.save();
    ctx.filter = 'brightness(50%) hue-rotate(0deg)';
    ctx.drawImage(pawnImg, pieceX, 420 - pawnImg.height/2);
    ctx.restore();
    drawText("CAN INCREASE PIECE ATTACK", canvas.width / 2 - pieceX/5, 420, 20, 'white');
};

export function drawHelpEnemy(){
    drawBackground();
    drawText("QUEEN", canvas.width / 2, 170, 100, 'black');
    drawText("QUEEN", canvas.width / 2, 165, 100, 'white');

    drawText("KILL THE EVIL QUEEN PIECE", canvas.width / 2, 225, 25, 'yellow');

    drawText("THE QUEEN HAS AN ATTACK RANGE OF 2 SQUARES", canvas.width / 2, 250, 20, 'white');

    drawText("SPECIAL ATTACKS (UNLIMITED RANGED):", canvas.width / 2, 300, 20, 'white');
    
    drawText("INCREASE ATTACK", canvas.width / 2, 350, 22, 'white');

    drawText("APPLIES DAMAGE OVER TIME TO PIECES", canvas.width / 2, 375, 22, 'white');
    drawText("INCREASES DAMAGE OVER TIME IF ALREADY CURSED", canvas.width / 2, 390, 22, 'white');

    drawText("RESTORES SOME HEALTH", canvas.width / 2, 440, 22, 'white');
};

function drawBackground(){
    ctx.beginPath();
    ctx.fillStyle = '#265b5f';
    ctx.fillRect(0, 130, canvas.width, 410);
    ctx.closePath();
}