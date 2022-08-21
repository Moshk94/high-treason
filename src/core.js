import { drawTitlePage } from './titlepage.js'
import { gamePhase, screenFade } from './transitions.js'
import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { pauseScreen } from './playsScreen.js';
import { changeTransitionTo } from "./transitions";
import { DrawTextWithLink } from './classes.js';
import { drawBoard } from './boardUI.js';

export const ctx = document.getElementById('canvas').getContext("2d");

export let mouseX;
export let mouseY;

export let textWithLink = [
    new DrawTextWithLink("RESUME", canvas.width / 2, 350, 50, "yellow", [-1], 3, 1),
    new DrawTextWithLink("QUIT", canvas.width / 2, 410, 50, "yellow", [-1], 0, 1),
    new DrawTextWithLink("PLAY", canvas.width / 2, 420, 75, "#333", [0], 3, 1),
    new DrawTextWithLink("HELP", canvas.width / 2, 495, 50, "#333", [0], 2.1, 1),
    new DrawTextWithLink("PLAY", canvas.width / 2, 495, 50, "#333", [2.1,2.2], 3, 1),
    new DrawTextWithLink("<|", canvas.width / 2 + 80, 496, 50, "#333", [2.1], 2.2, 1),
    new DrawTextWithLink("|>", canvas.width / 2 - 80, 496, 50, "#333", [2.2], 2.1, 1),
]

canvas.addEventListener('mousemove', function (e) {
    let rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
}, false);

canvas.addEventListener('mouseup', function (e) {
    if (gamePhase == -1) {
        pauseScreen(mouseX, mouseY, e)
    }

    textWithLink.forEach(e => {
        e.click();
    });
}, false);

canvas.addEventListener('keydown', function (e) {
    if (gamePhase == 3 && e.keyCode == 27) {
        changeTransitionTo(-1);
    } else if (gamePhase == -1 && e.keyCode == 27) {
        changeTransitionTo(3);
    }
})

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gamePhase == 0) {// Title Screen
        drawTitlePage();
    } else if (gamePhase == 2.1) { // Help Page 1
        drawHelpPlayer();
    } else if (gamePhase == 2.2) { // Help Page 2
        drawHelpEnemy();
    } else if (gamePhase == 3 || gamePhase == -1) {
        drawBoard();
    };

    for (let i = 2; i < textWithLink.length; i++) {
       textWithLink[i].draw();
    }
    screenFade();

    // ctx.save();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height)
    // ctx.restore();
    // ctx.save();
    // ctx.fillStyle = 'red';
    // ctx.fillRect(0, canvas.height/2-2.5, canvas.width, 5)
    // ctx.restore();
}, 1 / 60);