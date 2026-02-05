import dayjs from "dayjs";
import {
  fonts,
  headerDayHeight,
  headerHeight,
  headerWeekHeight
} from "@/constants";
import { Theme } from "@/styles";
import { Day } from "@/types/global";
import { getBoxFillStyle } from "@/utils/getBoxFillStyle";
import { getTextStyle } from "@/utils/getTextStyle";
import { drawRow } from "../../drawRow";

// Cell width for month view (zoom 3) - must match getTileXAndWidth
const MONTH_VIEW_DAY_WIDTH = 3;

/**
 * Google Calendar-style month header drawing for month/year view.
 *
 * Approach:
 * 1. Calculate total days to display based on canvas width
 * 2. Find all months that overlap with the visible range
 * 3. For each month, calculate its x position and width based on actual calendar days
 */
export const drawMonthsOnBottom = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme,
  monthLabel?: string
) => {
  const dayNameYPos = headerHeight - headerDayHeight / 1.6;
  const dayNumYPos = headerHeight - headerDayHeight / 4.5;
  const yPos = 20;
  const canvasWidth = ctx.canvas.width;

  // Calculate total days visible
  const totalDays = Math.ceil(canvasWidth / MONTH_VIEW_DAY_WIDTH);

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
    const xPos = daysFromStart * MONTH_VIEW_DAY_WIDTH;

    // Calculate width (number of visible days in this month)
    const visibleDays = visibleEnd.diff(visibleStart, "day") + 1;
    const width = visibleDays * MONTH_VIEW_DAY_WIDTH;

    const isCurrMonth = currentMonthStart.isSame(dayjs(), "month");

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos - 1,
        width: width,
        height: headerWeekHeight,
        isBottomRow: true,
        fillStyle: getBoxFillStyle({ isCurrent: isCurrMonth, variant: "yearView" }, theme),
        topText: {
          y: dayNameYPos + 5,
          label: "",
          font: fonts.bottomRow.name,
          color: getTextStyle({ isCurrent: isCurrMonth }, theme)
        },
        bottomText: {
          y: dayNumYPos,
          label: currentMonthStart.format("MMM"),
          font: fonts.middleRow,
          color: getTextStyle({ isCurrent: isCurrMonth }, theme)
        }
      },
      theme
    );

    // Move to next month
    currentMonthStart = currentMonthStart.add(1, "month");
  }
};
