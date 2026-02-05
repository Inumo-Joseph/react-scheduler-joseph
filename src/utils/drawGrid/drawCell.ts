import { boxHeight } from "@/constants";
import { Theme } from "@/styles";

export const drawCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rows: number,
  width: number,
  isBusinessDay: boolean,
  isCurrentDay: boolean,
  theme: Theme,
  flag?: boolean
) => {
  const borderColor = theme.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  if (isCurrentDay && flag) {
    // Draw subtle today column highlight
    const lineHeight = rows * boxHeight * 2;

    // Soft column background tint
    ctx.fillStyle = theme.mode === "dark" ? "rgba(52, 199, 89, 0.06)" : "rgba(52, 199, 89, 0.05)";
    ctx.fillRect(x, y, width, boxHeight * 2);

    // Clean dashed vertical line
    ctx.strokeStyle = theme.mode === "dark" ? "rgba(52, 199, 89, 0.4)" : "rgba(52, 199, 89, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, lineHeight);
    ctx.stroke();

    // Cell border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.strokeRect(x + 0.5, y, width, boxHeight * 2);
  } else if (isBusinessDay) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.fillStyle = "transparent";
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeRect(x + 0.5, y, width, boxHeight * 2);
  } else {
    // Weekend/non-business day - subtle tint
    ctx.fillStyle = theme.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)";
    ctx.fillRect(x, y, width, boxHeight * 2);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeRect(x + 0.5, y, width, boxHeight * 2);
  }
};
