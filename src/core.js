import {ctx} from './constants.js'
import {animateTitle} from './titlepage.js'

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animateTitle();

}, 1/60);