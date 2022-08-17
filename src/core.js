import { drawTitlePage, handleTitleMouseEvents } from './titlepage.js'
import { gamePhase, screenFade } from './transitions.js'
import { drawHelpPlayer, drawHelpKing } from './helpPage.js'

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
        handleTitleMouseEvents(mouseX,mouseY,e)
    }
}, false);

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (gamePhase) {
        case 0: { // Title Screen

            ctx.beginPath();
            ctx.fillStyle = '#265b5f';
            ctx.fillRect(0, 250, canvas.width, 310);
            ctx.closePath();

            
            drawTitlePage(mouseX, mouseY);
            break;
        };
        case 2.1: { // Help Page 1
            drawHelpPlayer();
            break;
        }
        case 2.2: { // Help Page 2
            drawHelpKing();
            break;
        }
    }

    screenFade();

    ctx.save();
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height)
    ctx.restore();
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.fillRect(0, canvas.height/2-2.5, canvas.width, 5)
    ctx.restore();
}, 1 / 60);