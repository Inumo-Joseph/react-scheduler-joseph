import dayjs from "dayjs";
import {
  fonts,
  headerWeekHeight,
  singleDayWidth,
  topRowTextYPos
} from "@/constants";
import { Day } from "@/types/global";
import { Theme } from "@/styles";
import { drawRow } from "../../drawRow";

/**
 * Google Calendar-style month header drawing for week view.
 *
 * Approach:
 * 1. Calculate total days to display based on canvas width
 * 2. Find all months that overlap with the visible range
 * 3. For each month, calculate its x position and width based on actual calendar days
 * 4. Handle partial months at the start/end of the visible range
 */
export const drawMonthsInMiddle = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  const yPos = 0;
  const canvasWidth = ctx.canvas.width;

  // Calculate total days visible
  const totalDays = Math.ceil(canvasWidth / singleDayWidth);

  const rangeStart = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`);
  const rangeEnd = rangeStart.add(totalDays, "days");

  // Start from the 1st of the month containing startDate
  let currentMonthStart = rangeStart.startOf("month");

  while (currentMonthStart.isBefore(rangeEnd)) {
    const currentMonthEnd = currentMonthStart.endOf("month");

    // Calculate visible portion of this month
    const visibleStart = currentMonthStart.isBefore(rangeStart) ? rangeStart : currentMonthStart;
    const visibleEnd = currentMonthEnd.isAfter(rangeEnd) ? rangeEnd : currentMonthEnd;

    // Calculate x position (days from rangeStart)
    const daysFromStart = visibleStart.diff(rangeStart, "day");
    const xPos = daysFromStart * singleDayWidth;

    // Calculate width (number of visible days in this month)
    const visibleDays = visibleEnd.diff(visibleStart, "day") + 1;
    const width = visibleDays * singleDayWidth;

    const monthLabel = currentMonthStart.format("MMMM").toUpperCase();

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width,
        height: headerWeekHeight,
        textYPos: topRowTextYPos - 5,
        label: monthLabel,
        font: fonts.bottomRow.number
      },
      theme
    );

    // Move to next month
    currentMonthStart = currentMonthStart.add(1, "month");
  }
};
