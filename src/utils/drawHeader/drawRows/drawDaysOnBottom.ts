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
import { drawRow } from "../../drawRow";
import { getBoxFillStyle } from "../../getBoxFillStyle";
import { getTextStyle } from "../../getTextStyle";

export const drawDaysOnBottom = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  const dayNameYPos = headerHeight - headerDayHeight / dayNameYoffset;
  const dayNumYPos = headerHeight - headerDayHeight / dayNumYOffset;
  const canvasHeight = headerMonthHeight + headerWeekHeight + headerDayHeight;
  let xPos = 0;
  const yPos = headerMonthHeight + headerWeekHeight + headerDayHeight / 2;

  for (let i = 0; i < cols; i++) {
    const day = parseDay(
      dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(i, "days")
    );
    const dayLabel = `${day.dayName.toUpperCase()} ${day.dayOfMonth}`;

    const isToday = day.isCurrentDay;

    // if (isToday) {
    //   // Draw vertical green line
    //   ctx.beginPath();
    //   ctx.moveTo(xPos + dayWidth / 2, 0); // or header height if you only want below header
    //   ctx.lineTo(xPos + dayWidth / 2, canvasHeight);
    //   ctx.strokeStyle = "#38A169"; // green
    //   ctx.lineWidth = 2;
    //   ctx.stroke();
    // }

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
    ctx.fillText(dayLabel, textX, yPos);

    xPos += dayWidth;
  }
};
