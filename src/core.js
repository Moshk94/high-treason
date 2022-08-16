import { ctx } from './constants.js'
import { drawTitleText, animatePlayButton, animateH2PButton } from './titlepage.js'
import { gamePhase, screenFade, changeTransitionTo } from './transitions.js'
import { drawHelpPlayer, drawHelpKing } from './helpPage.js'

canvas.addEventListener('click', function (e) {

    if (gamePhase == 0) {

    }
}, false);

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(gamePhase) {
        case 0: { // Title Screen
            drawTitleText();
            animatePlayButton();
            animateH2PButton();
            screenFade()
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
}, 1 / 60);