import { ctx } from './constants.js'
import { animateTitle, animatePlayButton, animateH2PButton } from './titlepage.js'
import { gamePhase, screenFade, changeTransitionTo } from './transitions.js'
import { drawHelpPlayer, drawHelpKing } from './helpPage.js'

canvas.addEventListener('click', function (e) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    if (gamePhase == 0) {
        if (mouseX > 220 && mouseX < 410 && mouseY > 400 && mouseY < 450) {
            console.log("Go to play")
            //changeTransitionTo(1)
        }

        if (mouseX > 254 && mouseX < 374 && mouseY > 516 && mouseY < 551) {
            changeTransitionTo(2.1)
            console.log("Go to help")
        }
    }
}, false);

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(gamePhase) {
        case 0: {
            ctx.fillStyle = 'green';
            ctx.fillRect(220, 400, 190, 50);
            ctx.fillRect(254, 516, 120, 35);
            animateTitle();
            animatePlayButton();
            animateH2PButton();
            screenFade()
            break;
        };
        case 2.1: {
            drawHelpPlayer();
            break;
        }
        case 2.2: {
            drawHelpKing();
            break;
        }
    }
}, 1 / 60);