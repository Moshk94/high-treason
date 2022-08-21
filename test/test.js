import { drawDebuggerGrid } from "./debugTools";

export const ctx = document.getElementById('canvas')
                    .getContext("2d");
const boardX = 125;
const boardY = 200;
const cellSize = 50;

let mouseX;
let mouseY;

canvas.addEventListener('mousemove', function (e) { }, false);

canvas.addEventListener('mouseup', function (e) { }, false);

const pawnImg = new Image();
pawnImg.src = 'p.png';
// TODO: To move along the Y axis use (cellSize * 0.8 * N) where N is the cell nubmer
setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDebuggerGrid();
    drawBoard();
    ctx.drawImage(pawnImg, 130, (190-10)+(50*0.8*0));
    console.log(50*0.8*7)
}, 1 / 60);




function drawBoard() {
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