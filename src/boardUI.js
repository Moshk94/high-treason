import { ctx } from "./core";

export const boardX = 125;
export const boardY = 200;
export const cellSize = 50;

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
    };
};