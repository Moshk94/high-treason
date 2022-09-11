import { ctx, speed } from "./core";

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
    drawText(text,centerX,centerY + fontsize/10,fontsize, 'black');
    drawText(text,centerX,centerY,fontsize, color);
};

export function rads(d){return d * 0.01745};

export const FLOOR = Math.floor;

export const dir = {
    'ArrowUp': {
        x: 0,
        y: -speed,
        p: -7
    },
    'ArrowDown': {
        x: 0,
        y: speed,
        p: 7
    },
    'ArrowRight': {
        x: speed,
        y: 0,
        p: 1
    },
    'ArrowLeft': {
        x: -speed,
        y: 0,
        p: -1
    },
};