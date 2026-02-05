import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Day } from "@/types/global";
import {
  fonts,
  headerDayHeight,
  headerHeight,
  headerWeekHeight,
  weekWidth,
  singleDayWidth
} from "@/constants";
import { Theme } from "@/styles";
import { drawRow } from "../../drawRow";
import { getBoxFillStyle } from "../../getBoxFillStyle";
import { getTextStyle } from "../../getTextStyle";

dayjs.extend(isoWeek);

/**
 * Draw week view header (zoom=0).
 *
 * Structure:
 * - Top row: Months (variable width based on days in month)
 * - Bottom row: Weeks (fixed weekWidth = 84px = 7 days × 12px)
 *
 * Uses cols parameter (number of weeks) instead of canvas.width to avoid DPR issues.
 */
export const drawWeekViewHeader = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  weekLabel: string,
  theme: Theme
) => {
  const rangeStart = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`);
  // cols = number of weeks, so total days = cols * 7
  const totalDays = cols * 7;
  const rangeEnd = rangeStart.add(totalDays, "days");

  // === TOP ROW: MONTHS ===
  drawMonthsTopRow(ctx, rangeStart, totalDays, theme);

  // === BOTTOM ROW: WEEKS ===
  drawWeeksBottomRow(ctx, cols, rangeStart, weekLabel, theme);
};

/**
 * Draw months in top row for week view.
 * Uses loop based on total days, positions based on singleDayWidth.
 */
function drawMonthsTopRow(
  ctx: CanvasRenderingContext2D,
  rangeStart: dayjs.Dayjs,
  totalDays: number,
  theme: Theme
) {
  const yPos = 0;
  const rangeEnd = rangeStart.add(totalDays, "days");
  let currentMonthStart = rangeStart.startOf("month");

  while (currentMonthStart.isBefore(rangeEnd)) {
    const currentMonthEnd = currentMonthStart.endOf("month");

    // Calculate visible portion of this month
    const visibleStart = currentMonthStart.isBefore(rangeStart) ? rangeStart : currentMonthStart;
    const visibleEnd = currentMonthEnd.isAfter(rangeEnd) ? rangeEnd : currentMonthEnd;

    // Calculate x position and width based on days
    const daysFromStart = visibleStart.diff(rangeStart, "day");
    const xPos = daysFromStart * singleDayWidth;
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
        textYPos: headerWeekHeight / 2 + 2,
        label: monthLabel,
        font: fonts.topRow
      },
      theme
    );

    currentMonthStart = currentMonthStart.add(1, "month");
  }
}

/**
 * Draw weeks in bottom row for week view.
 * Simple loop: iterate cols times, each week at i * weekWidth.
 */
function drawWeeksBottomRow(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rangeStart: dayjs.Dayjs,
  weekLabel: string,
  theme: Theme
) {
  const yPos = headerWeekHeight - 1;
  const dayNameYPos = headerHeight - headerDayHeight / 1.6;
  const dayNumYPos = headerHeight - headerDayHeight / 4.5;

  for (let i = 0; i < cols; i++) {
    const week = rangeStart.add(i, "weeks");
    const xPos = i * weekWidth;

    const isCurrWeek = week.isSame(dayjs(), "isoWeek");
    const weekNumber = week.isoWeek();

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width: weekWidth,
        height: headerWeekHeight,
        isBottomRow: true,
        fillStyle: getBoxFillStyle({ isCurrent: isCurrWeek, variant: "yearView" }, theme),
        topText: {
          y: dayNameYPos,
          label: "",
          font: fonts.bottomRow.name,
          color: "#F5F5F5"
        },
        bottomText: {
          y: dayNumYPos,
          label: `${weekLabel.toUpperCase()} ${weekNumber}`,
          font: fonts.middleRow,
          color: getTextStyle({ isCurrent: isCurrWeek }, theme)
        }
      },
      theme
    );
  }
}
