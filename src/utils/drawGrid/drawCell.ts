import { ChevronsLeftRightEllipsisIcon } from "lucide-react";
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
  ctx.strokeStyle = theme.colors.border;
  if (isCurrentDay && flag) {
    const dayTheme = "black";

    ctx.lineWidth = 0.15;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = dayTheme;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0.5);
    ctx.lineTo(x + 0.5, innerWidth);

    ctx.stroke();
    ctx.strokeStyle = theme.colors.border;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeRect(x + 0.5, y, width, boxHeight * 2);
  } else if (isBusinessDay) {
    ctx.lineWidth = 0.15;

    ctx.fillStyle = "transparent";
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeRect(x + 0.5, y, width, boxHeight * 2);
  } else {
    ctx.fillStyle = theme.colors.primary;
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeRect(x + 0.5, y, width, boxHeight * 2);
  }
};
