import dayjs from "dayjs";
import { boxHeight, singleDayWidth, weekWidth } from "@/constants";
import { Day } from "@/types/global";
import { Theme } from "@/styles";
import { drawCell } from "./drawCell";

/**
 * Draw grid for week view (zoom=0).
 * Each cell represents one week with fixed weekWidth (84px = 7 days × 12px).
 * Calculates number of columns needed based on canvas width to handle all zoom levels.
 */
export const drawWeeklyView = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  // Calculate columns needed to fill canvas width (accounts for browser zoom)
  const canvasWidth = ctx.canvas.width / window.devicePixelRatio;
  const columnsNeeded = Math.ceil(canvasWidth / weekWidth) + 1;
  const actualCols = Math.max(cols, columnsNeeded);

  const lineHeight = rows * boxHeight * 2;
  const monthBoundaries: { x: number; monthName: string }[] = [];
  let lastMonth = -1;

  for (let i = 0; i < rows; i++) {
    for (let w = 0; w <= actualCols; w++) {
      const week = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(
        w,
        "weeks"
      );

      const isCurrWeek = week.isSame(dayjs(), "week");

      drawCell(ctx, w * weekWidth, i * boxHeight * 2, rows, weekWidth, true, isCurrWeek, theme);

      // Track month boundaries (when month changes)
      if (i === 0) {
        const currentMonth = week.month();
        if (lastMonth !== -1 && currentMonth !== lastMonth) {
          // Calculate exact x position of the 1st of the month within this week cell
          const firstOfMonth = week.startOf("month");
          const daysIntoWeek = firstOfMonth.diff(week, "day");
          const xOffset = daysIntoWeek * singleDayWidth;
          monthBoundaries.push({ x: w * weekWidth + xOffset, monthName: week.format("MMMM") });
        }
        lastMonth = currentMonth;
      }
    }
  }

  // Draw month boundary lines with vertical month names
  ctx.save();
  const boundaryColor = theme.mode === "dark" ? "rgba(110, 127, 245, 0.35)" : "rgba(110, 127, 245, 0.25)";
  const labelColor = theme.mode === "dark" ? "rgba(110, 127, 245, 0.6)" : "rgba(110, 127, 245, 0.5)";

  for (const boundary of monthBoundaries) {
    // Subtle boundary line
    ctx.strokeStyle = boundaryColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(boundary.x, 0);
    ctx.lineTo(boundary.x, lineHeight);
    ctx.stroke();

    // Vertical month name label
    ctx.setLineDash([]);
    ctx.fillStyle = labelColor;
    ctx.font = "500 9px 'Inter', 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.save();
    ctx.translate(boundary.x + 7, lineHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(boundary.monthName, 0, 0);
    ctx.restore();
  }
  ctx.restore();
};
