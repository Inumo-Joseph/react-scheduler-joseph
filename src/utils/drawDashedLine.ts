import { Theme } from "@/styles";

export const drawDashedLine = (
  ctx: CanvasRenderingContext2D,
  startPos: number,
  lineLength: number,
  theme: Theme,
  color?: any
) => {
  ctx.setLineDash([5, 5]);

  if (color) {
    // ctx.lineWidth = 0;
    // ctx.beginPath();
  }

  ctx.moveTo(startPos + 0.5, 0.5);
  ctx.lineTo(startPos + 0.5, lineLength + 0.5);
  ctx.stroke();
};
