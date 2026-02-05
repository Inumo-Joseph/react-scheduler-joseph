import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Day } from "@/types/global";
import { boxHeight, dayWidth } from "@/constants";
import { Theme } from "@/styles";
import { getIsBusinessDay } from "../dates";
import { drawCell } from "./drawCell";

dayjs.extend(isoWeek);

export const drawDailyView = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  const lineHeight = rows * boxHeight * 2;
  const weekBoundaries: { x: number; weekNum: number }[] = [];

  for (let i = 0; i < rows; i++) {
    for (let y = 0; y <= cols; y++) {
      const date = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(
        y,
        "days"
      );

      const isCurrentDay = date.isSame(dayjs(), "day");

      drawCell(
        ctx,
        y * dayWidth,
        i * 2 * boxHeight,
        rows,
        dayWidth,
        getIsBusinessDay(date),
        isCurrentDay,
        theme,
        true
      );

      // Track week boundaries (Monday = start of ISO week)
      if (i === 0 && date.isoWeekday() === 1 && y > 0) {
        weekBoundaries.push({ x: y * dayWidth, weekNum: date.isoWeek() });
      }
    }
  }

  // Draw week boundary lines with vertical week numbers
  ctx.save();
  const boundaryColor = theme.mode === "dark" ? "rgba(110, 127, 245, 0.35)" : "rgba(110, 127, 245, 0.25)";
  const labelColor = theme.mode === "dark" ? "rgba(110, 127, 245, 0.6)" : "rgba(110, 127, 245, 0.5)";

  for (const boundary of weekBoundaries) {
    // Subtle boundary line
    ctx.strokeStyle = boundaryColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(boundary.x, 0);
    ctx.lineTo(boundary.x, lineHeight);
    ctx.stroke();

    // Vertical week number label
    ctx.setLineDash([]);
    ctx.fillStyle = labelColor;
    ctx.font = "500 9px 'Inter', 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const weekLabel = `W${boundary.weekNum}`;
    ctx.save();
    ctx.translate(boundary.x + 7, lineHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(weekLabel, 0, 0);
    ctx.restore();
  }
  ctx.restore();
};
