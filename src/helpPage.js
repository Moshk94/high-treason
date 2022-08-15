import { ctx } from "./constants";

function drawTitle(x){
    ctx.beginPath();
    ctx.font = '50px serif';
    ctx.fillStyle = "black";
    ctx.fillText(x, canvas.width / 2 - ctx.measureText(x).width/2, 200);
    ctx.closePath();
};


export function drawHelpPlayer(){
    drawTitle("PAWNS")

    ctx.beginPath();
    ctx.font = '20px serif';
    ctx.fillStyle = "black";
    let txt = "MOVE ON THE STRAIGHTS - ACTIONS ON THE DIAGONALS"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 250);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '15px serif';
    ctx.fillStyle = 'white';
    txt = "NO ABILITIES - HAS INCREASED ATTACK"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 350);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '10px serif';
    ctx.fillStyle = 'green';
    txt = "CAN HEAL OTHER PIECES IN RANGE AND REMOVE CURSE FROM PIECES (HEALING IS DISTRIBUTED EVENLY)"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 400);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '15px serif';
    ctx.fillStyle = 'red';
    txt = "CAN INCREASE PIECE ATTACK"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 450);
    ctx.closePath();
}

export function drawHelpKing(){
    drawTitle("KING")

    ctx.beginPath();
    ctx.font = '25px serif';
    ctx.fillStyle = "black";
    let txt = "KILL THE EVIL KING PIECE"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 250);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '25px serif';
    ctx.fillStyle = "black";
    txt = "THE KING HAS AN ATTACK RANGE OF 2 SQUARES"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 280);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '25px serif';
    ctx.fillStyle = "black";
    txt = "KINGS SPECIAL ATTACK (UNLIMITED RANGED): "
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 310);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '25px serif';
    ctx.fillStyle = "black";
    txt = "ATTACK BUFF - BUFFS ATTACK"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 340);
    ctx.closePath();


    ctx.beginPath();
    ctx.font = '10px serif';
    ctx.fillStyle = "black";
    txt = "CURSE - APPLIES DAMAGE OVER TIME TO PIECES. INCREASES DAMAGE OVER TIME IF ALREADY CURSED"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 360);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '10px serif';
    ctx.fillStyle = "black";
    txt = "HEAL - RESTORES 35% HEALTH"
    ctx.fillText(txt, canvas.width/2 - ctx.measureText(txt).width/2, 390);
    ctx.closePath();
}