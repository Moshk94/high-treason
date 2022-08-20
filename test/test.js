const c = document.getElementById('canvas');
const ctx = c.getContext("2d");

let mouseX;
let mouseY;

canvas.addEventListener('mousemove', function (e) {}, false);

canvas.addEventListener('mouseup', function (e) {}, false);

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 }, 1 / 60);