import { drawText } from "./helperFunctions";
import { ctx } from "./core";

export function drawHelpPlayer(){

    drawBackground();
    drawText("PAWNS", canvas.width / 2, 170, 100, 'black');
    drawText("PAWNS", canvas.width / 2, 165, 100);
    
    drawText("MOVE ON THE STRAIGHTS - ACTION ON THE DIAGONALS", canvas.width / 2, 225, 20, 'yellow');

    drawText("NO ABILITIES - HAS INCREASED ATTACK", canvas.width / 2, 300, 20, 'white');
    
    drawText("CAN HEAL OTHER PIECES IN RANGE AND", canvas.width / 2, 350, 20, 'white');
    drawText("REMOVE CURSE FROM PIECES", canvas.width / 2, 365, 20, 'white');
    drawText("(HEALING IS DISTRIBUTED EVENLY)", canvas.width / 2, 380, 20, 'white');

    drawText("CAN INCREASE PIECE ATTACK", canvas.width / 2, 430, 20, 'white');
};

export function drawHelpEnemy(){
    drawBackground();
    drawText("QUEEN", canvas.width / 2, 170, 100, 'black');
    drawText("QUEEN", canvas.width / 2, 165, 100);

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