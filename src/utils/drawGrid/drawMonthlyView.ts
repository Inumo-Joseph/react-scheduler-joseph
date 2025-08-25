import dayjs from "dayjs";
import { boxHeight, monthWidth, singleDayWidth, weekWidth } from "@/constants";
import { Day } from "@/types/global";
import { Theme } from "@/styles";
import { drawDashedLine } from "../drawDashedLine";
import { getDaysInMonths } from "../dates";
import { drawCell } from "./drawCell";

export const drawMonthlyView = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  let xPos = 0;
  let startPos = -(startDate.dayOfMonth - 1) * singleDayWidth;

  for (let i = 0; i <= cols; i++) {
    const month = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(
      i,
      "months"
    );
    const isCurrMonth = month.isSame(dayjs(), "month");

    for (let y = 0; y < rows; y++) {
      drawCell(ctx, xPos, y * boxHeight * 2, rows, monthWidth, true, isCurrMonth, theme);
    }
    xPos += monthWidth;
  }

  for (let i = 0; i < cols; i++) {
    const width = getDaysInMonths(startDate, i) * singleDayWidth;
    startPos += width;
  }
};
