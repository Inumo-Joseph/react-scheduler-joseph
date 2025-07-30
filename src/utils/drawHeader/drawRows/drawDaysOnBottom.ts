import dayjs from "dayjs";
import { Day } from "@/types/global";
import {
  boxHeight,
  dayNameYoffset,
  dayNumYOffset,
  dayWidth,
  fonts,
  headerDayHeight,
  headerHeight,
  headerMonthHeight,
  headerWeekHeight,
  weeksInYear,
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
  theme: Theme,
  Rows?: number
) => {
  let xPos = -25;
  const yPos = headerMonthHeight - 15;
  const width = 7 * dayWidth;
  const startWeek = startDate.weekOfYear;
  const weeksThreshold = ctx.canvas.width / width + width;

  // for(let j = 0; j < weeksThreshold; j++)
  // {
  //    const day = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).day();
  //       let weekIndex = (startWeek + j) % weeksInYear;

  //       if (weekIndex <= 0) {
  //         weekIndex += weeksInYear;
  //       }
  //       console.log("week Index", weekIndex)
  // }

  for (let i = 0; i < cols; i++) {
    const day = parseDay(
      dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(i, "days")
    );
    const week = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(
      i,
      "weeks"
    );

    const dayLabel = `${day.dayName}${day.dayOfMonth}`;

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
    const lineStartY = yPos + 7;
    let lineEndY = boxHeight * cols;
    Rows ? (lineEndY = boxHeight * Rows) : (lineEndY = boxHeight * cols); // Use provided height or default
    // Draw the text
    if (isToday) {
      // Draw vertical green linew

      const ovalHeight = headerDayHeight / 2.5; // Thinner vertically
      const ovalWidth = dayWidth; // Leave some padding on sides

      const circleCenterY = yPos - headerDayHeight / 3.5; // Position circle above text
      ctx.beginPath();
      ctx.roundRect(xPos, circleCenterY, ovalWidth, ovalHeight, ovalHeight / 2);
      ctx.fillStyle = "#5bb475";
      ctx.fill();
      ctx.fillStyle = "white";

      const lineX = xPos + 0.5 + dayWidth / 2;

      //  drawDashedLine(ctx, lineX, cols , originalStrokeStyle)
      // Set dashed line style

      // Save current line style
      for (let i = 0; i < 12; i++) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 0.1;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        ctx.moveTo(lineX, lineStartY);
        ctx.lineTo(lineX, 38);
        ctx.stroke();
        lineEndY += 120;
      }

      // Restore original line style
    } else {
      const ovalHeight = headerDayHeight / 2; // Thinner vertically

      ctx.beginPath();
      ctx.rect(xPos, yPos, dayWidth, ovalHeight);
      ctx.fillStyle = "#F5F5F5";
      ctx.fill();
      ctx.fillStyle = "#607D8B";
    }

    ctx.fillText(dayLabel, textX, yPos);

    xPos += dayWidth;
  }
};
