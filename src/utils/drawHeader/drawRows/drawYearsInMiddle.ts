import dayjs from "dayjs";
import {
  fonts,
  middleRowTextYPos,
  headerWeekHeight,
  singleDayWidth,
  headerMonthHeight
} from "@/constants";
import { Theme } from "@/styles";
import { daysInYear } from "@/utils/dates";
import { Day } from "@/types/global";
import { drawRow } from "../../drawRow";

export const drawYearsInMiddle = (ctx: CanvasRenderingContext2D, startDate: Day, theme: Theme) => {
  const yPos = headerMonthHeight;
  const canvasWidth = ctx.canvas.width * 2;

  const getDayOfYear = (day: Day): number => {
    return dayjs(`${day.year}-${day.month + 1}-${day.dayOfMonth}`).dayOfYear();
  };

  let currentYear = startDate.year;
  const dayOffset = startDate.dayOfYear ?? getDayOfYear(startDate);
  const xPos = -((dayOffset - 1) * singleDayWidth);
  let totalWidth = 0;

  while (xPos + totalWidth < canvasWidth) {
    const yearDays = daysInYear(currentYear);
    const width = yearDays * singleDayWidth;

    drawRow(
      {
        ctx,
        x: xPos + totalWidth,
        y: yPos,
        width,
        height: headerWeekHeight,
        textYPos: middleRowTextYPos,
        label: `${currentYear}`,
        font: fonts.middleRow
      },
      theme
    );

    totalWidth += width;
    currentYear++;
  }
};
