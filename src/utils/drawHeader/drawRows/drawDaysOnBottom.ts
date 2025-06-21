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
  let xPos = -25;
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
    const lineStartY = yPos;
    const lineEndY = 1000; // Use provided height or default
    // Draw the text
    if (isToday) {
      // Draw vertical green line

      const ovalHeight = headerDayHeight / 2; // Thinner vertically
      const ovalWidth = dayWidth; // Leave some padding on sides

      const circleCenterY = yPos - headerDayHeight / 4; // Position circle above text
      ctx.beginPath();
      ctx.roundRect(xPos, circleCenterY, ovalWidth, ovalHeight, ovalHeight / 2);
      ctx.fillStyle = "green";
      ctx.fill();
      ctx.fillStyle = "white";

      const lineX = xPos + dayWidth / 2;

      // Save current line style
      const originalStrokeStyle = ctx.strokeStyle;
      const originalLineWidth = ctx.lineWidth;

      //  drawDashedLine(ctx, lineX, cols , originalStrokeStyle)
      // Set dashed line style

      // Save current line style

      // Set dashed line style
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // 5px dash, 5px gap

      ctx.beginPath();
      ctx.moveTo(lineX, lineStartY);
      ctx.lineTo(lineX, lineEndY);
      ctx.stroke();

      // Restore original line style

      // drawDashedLine(ctx, lineStartY, originalLineWidth , theme)
    }

    ctx.fillText(dayLabel, textX, yPos);

    xPos += dayWidth;
  }
};
