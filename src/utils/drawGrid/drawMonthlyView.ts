import dayjs from "dayjs";
import { boxHeight } from "@/constants";
import { Day } from "@/types/global";
import { Theme } from "@/styles";
import { drawCell } from "./drawCell";

// Cell width per day for month view (zoom 3) - must match getTileXAndWidth
const MONTH_VIEW_DAY_WIDTH = 3;
// Average days per month for estimating columns needed
const AVG_DAYS_PER_MONTH = 30;

/**
 * Draw grid for month view (zoom=3).
 * Each cell represents one month with variable width based on days in month.
 * Calculates number of columns needed based on canvas width to handle all zoom levels.
 */
export const drawMonthlyView = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  // Calculate columns needed to fill canvas width (accounts for browser zoom)
  const canvasWidth = ctx.canvas.width / window.devicePixelRatio;
  const avgMonthWidth = AVG_DAYS_PER_MONTH * MONTH_VIEW_DAY_WIDTH;
  const columnsNeeded = Math.ceil(canvasWidth / avgMonthWidth) + 2;
  const actualCols = Math.max(cols, columnsNeeded);

  let xPos = 0;

  for (let m = 0; m <= actualCols; m++) {
    const month = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(
      m,
      "months"
    );

    const isCurrMonth = month.isSame(dayjs(), "month");
    const daysInMonth = month.daysInMonth();
    const monthWidth = daysInMonth * MONTH_VIEW_DAY_WIDTH;

    for (let i = 0; i < rows; i++) {
      drawCell(ctx, xPos, i * boxHeight * 2, rows, monthWidth, true, isCurrMonth, theme);
    }

    xPos += monthWidth;
  }
};
