import { RefObject } from "react";
import { Day } from "@/types/global";
import { Theme } from "@/styles";
import { drawWeekViewHeader } from "./drawRows/newDrawWeekViewHeader";
import { drawDayViewHeader } from "./drawRows/newDrawDayViewHeader";
import { drawMonthViewHeader } from "./drawRows/newDrawMonthViewHeader";
import { drawZoom2DaysInMiddle } from "./drawRows/drawZoom2DaysInMiddle";
import { drawZoom2MonthsOnTop } from "./drawRows/DrawZoom2MonthsOnTop";
import { drawZoom2HoursOnBottom } from "./drawRows/drawZoom2HoursOnBottom";

export const drawHeader = (
  ctx: CanvasRenderingContext2D,
  zoom: number,
  cols: number,
  startDate: Day,
  weekLabel: string,
  dayOfYear: number,
  theme: Theme,
  Rows?: number,
  canvasRef?: RefObject<HTMLCanvasElement>
) => {
  switch (zoom) {
    case 0:
      // Week view: Months on top, Weeks on bottom
      drawWeekViewHeader(ctx, cols, startDate, weekLabel, theme);
      break;

    case 1:
      // Day view: Days with highlighting for today
      drawDayViewHeader(ctx, cols, startDate, theme, Rows, canvasRef);
      break;

    case 3:
      // Month view: Years on top, Quarters in middle, Months on bottom
      drawMonthViewHeader(ctx, cols, startDate, dayOfYear, theme);
      break;

    case 2:
      // Hour view (zoom 2) - keep existing implementation
      drawZoom2MonthsOnTop(ctx, cols, startDate, theme);
      drawZoom2DaysInMiddle(ctx, cols, startDate, theme);
      drawZoom2HoursOnBottom(ctx, cols, startDate, theme);
      break;
  }
};
