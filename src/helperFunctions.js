import { ctx } from "./core";

export function drawText(text, centerX, centerY, fontsize, color = '#333') {
    ctx.save();
    ctx.font = `${fontsize}px p`
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
};

export function drawTextWithShadow(text, centerX, centerY, fontsize, color = 'white'){
    drawText(text,centerX,centerY + fontsize/10,fontsize, 'black')
    drawText(text,centerX,centerY,fontsize, color)
}
