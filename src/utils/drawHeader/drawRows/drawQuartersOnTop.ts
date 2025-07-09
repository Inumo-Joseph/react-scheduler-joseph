import dayjs from "dayjs";
import { Day } from "@/types/global";
import {
  dayWidth,
  fonts,
  headerDayHeight,
  headerHeight,
  headerMonthHeight,
  headerWeekHeight,
  middleRowTextYPos,
  monthsInYear,
  topRowTextYPos,
  weeksInYear,
  weekWidth
} from "@/constants";
import { drawRow } from "@/utils/drawRow";
import { Theme } from "@/styles";
import { getBoxFillStyle } from "@/utils/getBoxFillStyle";
import { getTextStyle } from "@/utils/getTextStyle";

export const drawQuartersOnTop = (
  ctx: CanvasRenderingContext2D,
  startDate: Day,
  cols: number,
  theme: Theme
) => {
  const yPos = 2;
  const quarterLabelY = headerWeekHeight / 1.6;
  let xPos = 0;
  let yearIndex = 0;

  let lastDrawnQuarter = -1;
  for (let i = 0; i < cols; i++) {
    yearIndex += 4;
    const currentWeek = dayjs(
      `${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`
    ).add(i, "week");
    const isoWeek = currentWeek.isoWeek();
    const year = startDate.year;

    const quarter = Math.floor((isoWeek - 1) / 13);
    if (quarter !== lastDrawnQuarter && quarter >= 0 && quarter < 4) {
      const quarterLabel = `Q${quarter + 1} - ${startDate.year + 1}`;

      drawRow(
        {
          ctx,
          x: xPos,
          y: yPos,
          width: 13 * weekWidth,
          height: headerMonthHeight,
          textYPos: topRowTextYPos,
          label: quarterLabel,
          font: fonts.topRow
        },
        theme
      );

      lastDrawnQuarter = quarter;
    }

    xPos += weekWidth;
  }
};
