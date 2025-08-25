import dayjs from "dayjs";
import { Day } from "@/types/global";
import { boxHeight, dayWidth, singleDayWidth } from "@/constants";
import { Theme } from "@/styles";
import { getIsBusinessDay, parseDay } from "../dates";
import { drawCell } from "./drawCell";

export const drawDailyView = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
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
    }
  }
};
