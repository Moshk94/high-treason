import { ctx, boardX, boardY, cellSize, playerPieces, PI } from "./test"; 
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


export function drawInformationSection() {
    for (let i = 0; i < playerPieces.length; i++) {
        const infoX = boardX - 50 + (175 * i);
        const dx = 20;

        ctx.fillStyle = "black";
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 75);

        ctx.fillStyle = "grey"
        ctx.fillRect(infoX, boardY + cellSize * 7 - 25, 130, 20);

        drawText(`${playerPieces[i].currentHP} / ${playerPieces[i].maxHP}`,infoX + 75,boardY + cellSize * 7 - 16,25,'white');

        drawText(`Att: ${playerPieces[i].attack}`,infoX + 75,boardY + cellSize * 7 + 10,25,'darkred');

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.arc(infoX,boardY + cellSize * 7 - 10,20,0,2 * PI);
        ctx.stroke();
        ctx.fillStyle = "black"
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 3;
        ctx.arc(infoX,boardY + cellSize * 7 - 10,20,-PI / 2, (PI * 2) * playerPieces[i].currentHP / playerPieces[i].maxHP - PI / 2);
        ctx.stroke();
        
        playerPieces[i].draw(infoX - 10, boardY + cellSize * 7 - 25, dx, dx * 1.5);
    };
};
