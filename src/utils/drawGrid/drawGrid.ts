import { Day } from "@/types/global";
import { canvasWrapperId } from "@/constants";
import { Theme } from "@/styles";
import { drawWeeklyView } from "./drawWeeklyView";
import { drawHourlyView } from "./drawHourlyView";
import { drawQuarterlyView } from "./drawQuarterlyView";
import { drawDailyView } from "./drawDailyView";
import { drawMonthlyView } from "./drawMonthlyView";

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  zoom: number,
  rows: number,
  cols: number,
  parsedStartDate: Day,
  theme: Theme
) => {
  const canvasWrapper = document.getElementById(canvasWrapperId);
  console.log("Draw Grid called", canvasWrapper);

  if (!canvasWrapper) return;

  switch (zoom) {
    //  case 0:
    //   drawQuarterlyView(ctx,rows,parsedStartDate,theme)
    //   break;
    case 0:
      drawWeeklyView(ctx, rows, cols, parsedStartDate, theme);
      break;
    case 1:
      drawDailyView(ctx, rows, cols, parsedStartDate, theme);
      break;
    case 3:
      drawMonthlyView(ctx, rows, cols, parsedStartDate, theme);
    //   break;
  }
};
