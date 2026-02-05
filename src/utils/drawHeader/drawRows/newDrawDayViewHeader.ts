import dayjs from "dayjs";
import { RefObject } from "react";
import { Day } from "@/types/global";
import {
  boxHeight,
  dayWidth,
  fonts,
  headerDayHeight,
  headerMonthHeight
} from "@/constants";
import { parseDay } from "@/utils/dates";
import { Theme } from "@/styles";
import { getTextStyle } from "../../getTextStyle";

/**
 * Draw day view header (zoom=1) with Google Calendar-style alignment.
 *
 * Structure:
 * - Single row showing day name + day number (e.g., "Mon 3")
 * - Today is highlighted with a green pill
 *
 * Key: Each day is dayWidth (50px) wide, positioned at i * dayWidth.
 */
export const drawDayViewHeader = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme,
  rows?: number,
  canvasRef?: RefObject<HTMLCanvasElement>
) => {
  const rangeStart = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`);
  const yPos = headerMonthHeight - 15;
  const gridHeight = canvasRef?.current?.getBoundingClientRect().height;

  for (let i = 0; i < cols; i++) {
    const date = rangeStart.add(i, "days");
    const day = parseDay(date);
    // Offset by half dayWidth so header center aligns with grid line at i * dayWidth
    const xPos = i * dayWidth - dayWidth / 2;

    const dayLabel = `${day.dayName}${day.dayOfMonth}`;
    const isToday = day.isCurrentDay;

    // Determine text color
    const textColor = getTextStyle(
      {
        isCurrent: isToday,
        isBusinessDay: day.isBusinessDay,
        variant: "bottomRow"
      },
      theme
    );

    ctx.fillStyle = textColor;
    ctx.font = fonts.bottomRow.number;

    // Center text in column
    const textWidth = ctx.measureText(dayLabel).width;
    const textX = xPos + (dayWidth - textWidth) / 2;

    if (isToday) {
      // Modern pill background for today
      const ovalHeight = headerDayHeight / 2.5;
      const ovalWidth = dayWidth;
      const circleCenterY = yPos - headerDayHeight / 3.5;

      ctx.beginPath();
      ctx.roundRect(xPos, circleCenterY, ovalWidth, ovalHeight, ovalHeight / 2);
      ctx.fillStyle = "#34C759";
      ctx.fill();
      ctx.fillStyle = "white";

      // Subtle dashed line below today
      const lineX = xPos + dayWidth / 2;
      const lineStartY = yPos + 7;
      const lineEndY = boxHeight / 1.5;

      ctx.strokeStyle = "rgba(52, 199, 89, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(lineX, lineStartY);
      ctx.lineTo(lineX, lineEndY);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Clean background for non-today columns
      const ovalHeight = headerDayHeight / 2;

      ctx.beginPath();
      ctx.rect(xPos, yPos, dayWidth, ovalHeight);
      ctx.fillStyle = theme.mode === "dark" ? "#1A1E27" : "#FAFBFC";
      ctx.fill();
      ctx.fillStyle = theme.mode === "dark" ? "#8993A4" : "#6B7280";
    }

    ctx.fillText(dayLabel, textX, yPos);
  }
};
