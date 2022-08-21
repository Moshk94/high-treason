const c = document.getElementById('canvas');
const ctx = c.getContext("2d");

const showGrid = true;
let mouseX;
let mouseY;

canvas.addEventListener('mousemove', function (e) { }, false);

canvas.addEventListener('mouseup', function (e) { }, false);

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
}, 1 / 60);

function drawDebuggerGrid() {
    let vDivisor = 50;
    let hDivisor = 50;
    let gridColor = 'rgba(255, 0, 0,0.1)'
    let verticalGrids = canvas.width / vDivisor;
    let horizontalGrids = canvas.height / hDivisor;
    if (showGrid) {
        for (let i = 1; i < verticalGrids; i++) {
            ctx.fillStyle = gridColor
            ctx.fillRect(i * vDivisor - 1, 0, 2, canvas.height);
        };

        for (let i = 1; i < horizontalGrids; i++) {
            ctx.fillStyle = gridColor;
            ctx.fillRect(0, i * hDivisor - 1, canvas.width, 2);
        };
    };
};