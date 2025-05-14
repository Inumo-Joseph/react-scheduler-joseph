import dayjs from "dayjs";
import {
  fonts,
  headerDayHeight,
  headerHeight,
  singleDayWidth,
  dayNumYOffset,
  headerMonthHeight,
  headerWeekHeight
} from "@/constants";
import { Theme } from "@/styles";
import { Day } from "@/types/global";
import { getDaysInMonths } from "@/utils/dates";
import { drawRow } from "../../drawRow";

export const drawMonthsOnBottom = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  let xPos = -startDate.dayOfMonth;
  const yPos = headerMonthHeight; // bottom row position
  const monthIndex = startDate.month;
  let index = monthIndex;

  for (let i = 0; i < cols; i++) {
    if (index >= 12) index = 0;
    const daysInMonth = getDaysInMonths(startDate, i);
    const width = daysInMonth * 3;

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width,
        height: headerDayHeight,
        textYPos: headerHeight - headerDayHeight / dayNumYOffset,
        label: dayjs().month(index).format("MMMM").toUpperCase(),
        font: fonts.bottomRow.name,
        isBottomRow: true
      },
      theme
    );

    // Draw a dividing line at the end of each month
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(xPos + width, yPos);
    ctx.lineTo(xPos + width, yPos + headerDayHeight);
    ctx.stroke();

    xPos += width;
    index++;
  }
};
