import { drawTitlePage, changeSelection } from './titlepage.js'
import { gamePhase, screenFade } from './transitions.js'
import { drawHelpPlayer, drawHelpEnemy } from './helpPage.js'
import { changePauseSelection } from './pauseScreen.js';
import { changeTransitionTo } from "./transitions";
import { drawBoard } from './boardUI.js';
export const ctx = document.getElementById('canvas').getContext("2d");

const pawnImg = new Image();
pawnImg.src = 'p.png';


canvas.addEventListener('keydown', function (e) {
    if (gamePhase == 0) {
        if (e.key == 'ArrowUp') {
            changeSelection(3);
        } else if (e.key == 'ArrowDown') {
            changeSelection(2.1);
        }

        if (e.key == 'z') {
            changeTransitionTo(changeSelection());
        };
    } else if (gamePhase == 3 && e.key == 'Escape') {
        // INFO: Game key function will go here.
        changeTransitionTo(-1);
        changePauseSelection(3)
    } else if (gamePhase == -1) {
        if (e.key == 'Escape') {
            changeTransitionTo(3);
        } else if (e.key == 'ArrowUp') {
            changePauseSelection(3);
        } else if (e.key == 'ArrowDown') {
            changePauseSelection(0);
        }

        if (e.key == 'z') {
            changeTransitionTo(changePauseSelection());
        };
    };
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gamePhase == 0) {
        // Title Screen
        drawTitlePage();
    } else if (gamePhase == 2.1) {
        // Help Page 1
        drawHelpPlayer();
    } else if (gamePhase == 2.2) {
        // Help Page 2
        drawHelpEnemy();
    } else if (gamePhase == 3 || gamePhase == -1) {
        drawBoard();
    };
    screenFade();
}, 1 / 60);