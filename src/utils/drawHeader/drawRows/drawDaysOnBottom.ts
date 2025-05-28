import dayjs from "dayjs";
import { Day } from "@/types/global";
import {
  dayNameYoffset,
  dayNumYOffset,
  dayWidth,
  fonts,
  headerDayHeight,
  headerHeight,
  headerMonthHeight,
  headerWeekHeight,
  zoom2HeaderBottomRowHeight,
  zoom2HeaderMiddleRowHeight,
  zoom2HeaderTopRowHeight
} from "@/constants";
import { parseDay } from "@/utils/dates";
import { Theme } from "@/styles";
import { drawDashedLine } from "@/utils/drawDashedLine";
import { drawRow } from "../../drawRow";
import { getBoxFillStyle } from "../../getBoxFillStyle";
import { getTextStyle } from "../../getTextStyle";

export const drawDaysOnBottom = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  let xPos = 0;
  const yPos = headerMonthHeight + headerWeekHeight + headerDayHeight / 2;

  for (let i = 0; i < cols; i++) {
    const day = parseDay(
      dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(i, "days")
    );
    const dayLabel = `${day.dayName.toUpperCase()} ${day.dayOfMonth}`;

    const isToday = day.isCurrentDay;

    // Determine styling
    const textColor = getTextStyle(
      {
        isCurrent: day.isCurrentDay,
        isBusinessDay: day.isBusinessDay,
        variant: "bottomRow"
      },
      theme
    );

    // Set styles
    ctx.fillStyle = textColor;
    ctx.font = fonts.bottomRow.number; // pick a combined or default font

    // Optional: Center text in column
    const textWidth = ctx.measureText(dayLabel).width;
    const textX = xPos + (dayWidth - textWidth) / 2;

    // Draw the text
    if (isToday) {
      // Draw vertical green line
      ctx.fillStyle = "green";
      ctx.fillRect(textX - 3, yPos - 20, dayWidth, headerDayHeight);
      ctx.fillStyle = "white";

      ctx.fillText(dayLabel, textX, yPos);
    }

    ctx.fillText(dayLabel, textX, yPos);

    xPos += dayWidth;
  }
};
