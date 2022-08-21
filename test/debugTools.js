import { ctx } from "./test"; 
const showGrid = true;

export function drawDebuggerGrid() {
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