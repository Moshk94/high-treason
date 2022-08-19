const c = document.getElementById('canvas');
const ctx = c.getContext("2d");

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 }, 1 / 60);