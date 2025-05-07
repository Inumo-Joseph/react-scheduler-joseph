import dayjs from "dayjs";
import { singleDayWidth, boxHeight } from "@/constants";
import { Day } from "@/types/global";
import { Theme } from "@/styles";
import { daysInYear } from "../dates";
import { drawDashedLine } from "../drawDashedLine";
import { drawCell } from "./drawCell";

export const drawQuarterlyView = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  startDate: Day,
  theme: Theme
) => {
  const year = startDate.year;
  const totalDays = daysInYear(year);
  let xPos = 0;

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const currentDate = dayjs(`${year}-01-01`).add(dayIndex, "day");

    const isCurrentDay = currentDate.isSame(dayjs(), "month");

    for (let y = 0; y < rows; y++) {
      drawCell(ctx, xPos, y * boxHeight, singleDayWidth, true, isCurrentDay, theme);
    }

    xPos += singleDayWidth;
  }

  // Optional: draw dashed lines at each month boundary
  let monthStartX = 0;
  for (let i = 0; i < 12; i++) {
    const daysInMonth = dayjs(`${year}-${i + 1}-01`).daysInMonth();
    const monthWidth = daysInMonth * singleDayWidth;

    drawDashedLine(ctx, monthStartX, rows * boxHeight, theme);
    monthStartX += monthWidth;
  }
};
