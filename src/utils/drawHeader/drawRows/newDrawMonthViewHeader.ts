import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { Day } from "@/types/global";
import {
  fonts,
  headerDayHeight,
  headerHeight,
  headerMonthHeight,
  headerWeekHeight,
  middleRowTextYPos,
  topRowTextYPos
} from "@/constants";
import { Theme } from "@/styles";
import { drawRow } from "../../drawRow";
import { getBoxFillStyle } from "../../getBoxFillStyle";
import { getTextStyle } from "../../getTextStyle";

dayjs.extend(quarterOfYear);

// Pixels per day for month view (zoom=3) - must match getTileXAndWidth
const DAY_WIDTH = 3;

/**
 * Draw month view header (zoom=3).
 *
 * Structure:
 * - Top row: Years (variable width based on days in year)
 * - Middle row: Quarters (variable width based on days in quarter)
 * - Bottom row: Months (simple loop with variable width per month)
 *
 * Uses cols parameter (number of months) instead of canvas.width to avoid DPR issues.
 */
export const drawMonthViewHeader = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  dayOfYear: number,
  theme: Theme
) => {
  const rangeStart = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`);
  // cols = number of months, calculate total days by summing days in each month
  const rangeEnd = rangeStart.add(cols, "months");

  // === TOP ROW: YEARS ===
  drawYearsTopRow(ctx, cols, rangeStart, rangeEnd, theme);

  // === MIDDLE ROW: QUARTERS ===
  drawQuartersMiddleRow(ctx, cols, rangeStart, rangeEnd, theme);

  // === BOTTOM ROW: MONTHS ===
  drawMonthsBottomRow(ctx, cols, rangeStart, theme);
};

/**
 * Draw years in top row for month view.
 */
function drawYearsTopRow(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rangeStart: dayjs.Dayjs,
  rangeEnd: dayjs.Dayjs,
  theme: Theme
) {
  const yPos = 2;
  let currentYearStart = rangeStart.startOf("year");

  while (currentYearStart.isBefore(rangeEnd)) {
    const currentYearEnd = currentYearStart.endOf("year");

    // Calculate visible portion of this year
    const visibleStart = currentYearStart.isBefore(rangeStart) ? rangeStart : currentYearStart;
    const visibleEnd = currentYearEnd.isAfter(rangeEnd) ? rangeEnd : currentYearEnd;

    // Calculate x position and width based on days
    const daysFromStart = visibleStart.diff(rangeStart, "day");
    const xPos = daysFromStart * DAY_WIDTH;
    const visibleDays = visibleEnd.diff(visibleStart, "day") + 1;
    const width = visibleDays * DAY_WIDTH;

    const yearLabel = currentYearStart.year().toString();

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width,
        height: headerMonthHeight,
        textYPos: topRowTextYPos,
        label: yearLabel,
        font: fonts.topRow
      },
      theme
    );

    currentYearStart = currentYearStart.add(1, "year");
  }
}

/**
 * Draw quarters in middle row for month view.
 */
function drawQuartersMiddleRow(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rangeStart: dayjs.Dayjs,
  rangeEnd: dayjs.Dayjs,
  theme: Theme
) {
  const yPos = headerMonthHeight - 30;
  let currentQuarterStart = rangeStart.startOf("quarter");

  while (currentQuarterStart.isBefore(rangeEnd)) {
    const currentQuarterEnd = currentQuarterStart.endOf("quarter");

    // Calculate visible portion of this quarter
    const visibleStart = currentQuarterStart.isBefore(rangeStart) ? rangeStart : currentQuarterStart;
    const visibleEnd = currentQuarterEnd.isAfter(rangeEnd) ? rangeEnd : currentQuarterEnd;

    // Calculate x position and width based on days
    const daysFromStart = visibleStart.diff(rangeStart, "day");
    const xPos = daysFromStart * DAY_WIDTH;
    const visibleDays = visibleEnd.diff(visibleStart, "day") + 1;
    const width = visibleDays * DAY_WIDTH;

    const quarterNumber = currentQuarterStart.quarter();
    const year = currentQuarterStart.year();
    const quarterLabel = `Q${quarterNumber} - ${year}`;

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width,
        height: headerDayHeight,
        textYPos: middleRowTextYPos - 30,
        label: quarterLabel,
        font: fonts.middleRow,
        isBottomRow: true
      },
      theme
    );

    currentQuarterStart = currentQuarterStart.add(1, "quarter");
  }
}

/**
 * Draw months in bottom row for month view.
 * Simple loop: iterate cols times, track xPos based on each month's actual days.
 */
function drawMonthsBottomRow(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rangeStart: dayjs.Dayjs,
  theme: Theme
) {
  const yPos = 20;
  const dayNameYPos = headerHeight - headerDayHeight / 1.6 + 5;
  const dayNumYPos = headerHeight - headerDayHeight / 4.5;

  let xPos = 0;

  for (let i = 0; i < cols; i++) {
    const month = rangeStart.add(i, "months");
    const daysInMonth = month.daysInMonth();
    const monthWidth = daysInMonth * DAY_WIDTH;

    const isCurrMonth = month.isSame(dayjs(), "month");

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos - 1,
        width: monthWidth,
        height: headerWeekHeight,
        isBottomRow: true,
        fillStyle: getBoxFillStyle({ isCurrent: isCurrMonth, variant: "yearView" }, theme),
        topText: {
          y: dayNameYPos,
          label: "",
          font: fonts.bottomRow.name,
          color: getTextStyle({ isCurrent: isCurrMonth }, theme)
        },
        bottomText: {
          y: dayNumYPos,
          label: month.format("MMM"),
          font: fonts.middleRow,
          color: getTextStyle({ isCurrent: isCurrMonth }, theme)
        }
      },
      theme
    );

    xPos += monthWidth;
  }
}
