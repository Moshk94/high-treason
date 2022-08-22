import { ctx } from "./test"; 
const showGrid = 1;

export function drawDebuggerGrid() {
    let vDivisor = 25;
    let hDivisor = 25;
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

export function drawText(text, centerX, centerY, fontsize, color = '#333') {
    ctx.save();
    ctx.font = `${fontsize}px p`
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
};




ctx.save();
ctx.fillStyle = 'red';
ctx.fillRect(canvas.width / 2 - 2.5, 0, 5, canvas.height)
ctx.restore();
ctx.save();
ctx.fillStyle = 'red';
ctx.fillRect(0, canvas.height/2-2.5, canvas.width, 5)
ctx.restore();