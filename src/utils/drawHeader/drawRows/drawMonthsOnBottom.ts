import dayjs from "dayjs";
import {
  fonts,
  headerDayHeight,
  headerHeight,
  singleDayWidth,
  dayNumYOffset,
  headerMonthHeight,
  headerWeekHeight,
  weekWidth,
  monthWidth
} from "@/constants";
import { Theme } from "@/styles";
import { Day } from "@/types/global";
import { getDaysInMonths } from "@/utils/dates";
import { getBoxFillStyle } from "@/utils/getBoxFillStyle";
import { getTextStyle } from "@/utils/getTextStyle";
import { drawRow } from "../../drawRow";

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
  let xPos = 0;

  for (let i = 0; i < cols; i++) {
    const month = dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`).add(
      i,
      "months"
    );
    const isCurrMonth = month.isSame(dayjs(), "month");
    const daysInMonth = getDaysInMonths(startDate, i);

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
          y: dayNameYPos + 5,
          label: "", // "Jan", "Feb", etc.
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
};
