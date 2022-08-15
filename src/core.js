import {ctx} from './constants.js'
import {animateTitle, animatePlayButton, animateH2PButton} from './titlepage.js'

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    animateTitle();
    animatePlayButton();
    animateH2PButton();

}, 1/60);