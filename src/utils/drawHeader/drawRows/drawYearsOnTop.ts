import dayjs from "dayjs";
import { fonts, headerMonthHeight, topRowTextYPos } from "@/constants";
import { Theme } from "@/styles";
import { Day } from "@/types/global";
import { drawRow } from "@/utils/drawRow";

// Cell width for month view (zoom 3) - must match getTileXAndWidth
const MONTH_VIEW_DAY_WIDTH = 3;

/**
 * Google Calendar-style year header drawing for month/year view.
 *
 * Approach:
 * 1. Calculate total days to display based on canvas width
 * 2. Find all years that overlap with the visible range
 * 3. For each year, calculate its x position and width based on actual calendar days
 */
export const drawYearsOnTop = (
  ctx: CanvasRenderingContext2D,
  startDate: Day,
  dayOfYear: number,
  theme: Theme
) => {
  const yPos = 2;
  const canvasWidth = ctx.canvas.width;

  // Calculate total days visible
  const totalDays = Math.ceil(canvasWidth / MONTH_VIEW_DAY_WIDTH);

  const rangeStart = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`);
  const rangeEnd = rangeStart.add(totalDays, "days");

  // Start from January 1st of the year containing startDate
  let currentYearStart = rangeStart.startOf("year");

  while (currentYearStart.isBefore(rangeEnd)) {
    const currentYearEnd = currentYearStart.endOf("year");

    // Calculate visible portion of this year
    const visibleStart = currentYearStart.isBefore(rangeStart) ? rangeStart : currentYearStart;
    const visibleEnd = currentYearEnd.isAfter(rangeEnd) ? rangeEnd : currentYearEnd;

    // Calculate x position (days from rangeStart)
    const daysFromStart = visibleStart.diff(rangeStart, "day");
    const xPos = daysFromStart * MONTH_VIEW_DAY_WIDTH;

    // Calculate width (number of visible days in this year)
    const visibleDays = visibleEnd.diff(visibleStart, "day") + 1;
    const width = visibleDays * MONTH_VIEW_DAY_WIDTH;

    const yearLabel = currentYearStart.year().toString();

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width: width,
        height: headerMonthHeight,
        textYPos: topRowTextYPos,
        label: yearLabel,
        font: fonts.topRow
      },
      theme
    );

    // Move to next year
    currentYearStart = currentYearStart.add(1, "year");
  }
};
