import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import {
  fonts,
  headerDayHeight,
  headerMonthHeight,
  middleRowTextYPos
} from "@/constants";
import { Theme } from "@/styles";
import { Day } from "@/types/global";
import { drawRow } from "@/utils/drawRow";

dayjs.extend(quarterOfYear);

// Cell width for month view (zoom 3) - must match getTileXAndWidth
const MONTH_VIEW_DAY_WIDTH = 3;

/**
 * Google Calendar-style quarter header drawing for month/year view.
 *
 * Approach:
 * 1. Calculate total days to display based on canvas width
 * 2. Find all quarters that overlap with the visible range
 * 3. For each quarter, calculate its x position and width based on actual calendar days
 */
export const drawQuartersInMiddle = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  const yPos = headerMonthHeight - 30;
  const canvasWidth = ctx.canvas.width;

  // Calculate total days visible
  const totalDays = Math.ceil(canvasWidth / MONTH_VIEW_DAY_WIDTH);

  const rangeStart = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`);
  const rangeEnd = rangeStart.add(totalDays, "days");

  // Start from the beginning of the quarter containing startDate
  let currentQuarterStart = rangeStart.startOf("quarter");

  while (currentQuarterStart.isBefore(rangeEnd)) {
    const currentQuarterEnd = currentQuarterStart.endOf("quarter");

    // Calculate visible portion of this quarter
    const visibleStart = currentQuarterStart.isBefore(rangeStart)
      ? rangeStart
      : currentQuarterStart;
    const visibleEnd = currentQuarterEnd.isAfter(rangeEnd) ? rangeEnd : currentQuarterEnd;

    // Calculate x position (days from rangeStart)
    const daysFromStart = visibleStart.diff(rangeStart, "day");
    const xPos = daysFromStart * MONTH_VIEW_DAY_WIDTH;

    // Calculate width (number of visible days in this quarter)
    const visibleDays = visibleEnd.diff(visibleStart, "day") + 1;
    const width = visibleDays * MONTH_VIEW_DAY_WIDTH;

    const quarterNumber = currentQuarterStart.quarter();
    const year = currentQuarterStart.year();
    const quarterLabel = `Q${quarterNumber} - ${year}`;

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width: width,
        height: headerDayHeight,
        textYPos: middleRowTextYPos - 30,
        label: quarterLabel,
        font: fonts.middleRow,
        isBottomRow: true
      },
      theme
    );

    // Move to next quarter
    currentQuarterStart = currentQuarterStart.add(1, "quarter");
  }
};
