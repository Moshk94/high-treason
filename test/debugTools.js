import { ctx, boardX, boardY, cellSize } from "./test"; 
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

export function drawBoard() {
    const bColor = '#a9a9a9';
    const wColor = '#000000';

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.strokeRect(boardX, boardY, 350, 280);

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            ctx.fillStyle = (i + j) % 2 == 0 ? bColor : wColor;
            ctx.fillRect(
                boardX + (cellSize * i),
                boardY + (j * cellSize * 0.8),
                cellSize,
                cellSize - 10
            );
        };
    }
};