import { drawTitlePage, handleTitleMouseEvents } from './titlepage.js'
import { gamePhase, screenFade } from './transitions.js'
import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { pauseScreen } from './playsScreen.js';
import { changeTransitionTo } from "./transitions";

export const ctx = document.getElementById('canvas').getContext("2d");

let mouseX;
let mouseY;

canvas.addEventListener('mousemove', function (e) {
    let rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
}, false);

canvas.addEventListener('mouseup', function (e) {
    if (gamePhase == 0) {
        handleTitleMouseEvents(mouseX, mouseY, e)
    } if( gamePhase == -1){
        pauseScreen(mouseX, mouseY, e)
    }
}, false);

canvas.addEventListener('keydown', function (e) {
    if (gamePhase == 3 && e.keyCode == 27) {
        changeTransitionTo(-1);
    } else if (gamePhase == -1 && e.keyCode == 27 ) {
        changeTransitionTo(3);
    }
})

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(gamePhase == 0){// Title Screen
        ctx.beginPath();
        ctx.fillStyle = '#265b5f';
        ctx.fillRect(0, 250, canvas.width, 310);
        ctx.closePath();

        drawTitlePage(mouseX, mouseY);
    } else if (gamePhase == 2.1){ // Help Page 1
        drawHelpPlayer();
    } else if (gamePhase == 2.2){ // Help Page 2
        drawHelpEnemy();
    } else if(gamePhase == 3 || gamePhase == -1){
    };

    screenFade();
    if(gamePhase == -1){
        pauseScreen(mouseX,mouseY)
    };
    // ctx.save();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height)
    // ctx.restore();
    // ctx.save();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(0, canvas.height/2-2.5, canvas.width, 5)
    // ctx.restore();
}, 1 / 60);