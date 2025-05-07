import dayjs from "dayjs";
import {
  fonts,
  headerMonthHeight,
  headerWeekHeight,
  middleRowTextYPos,
  monthsInYear,
  singleDayWidth,
  topRowTextYPos
} from "@/constants";
import { Theme } from "@/styles";
import { Day } from "@/types/global";
import { getDaysInMonths } from "@/utils/dates";
import { drawRow } from "@/utils/drawRow";

export const drawQuartersInMiddle = (
  ctx: CanvasRenderingContext2D,
  cols: number,
  startDate: Day,
  theme: Theme
) => {
  const yPos = headerMonthHeight; // middle row
  const canvasWidth = ctx.canvas.width * 2;

  let xPos = -(startDate.dayOfMonth - 1) * singleDayWidth;
  let currentYear = startDate.year;
  const currentMonth = startDate.month;
  let currentQuarter = Math.floor(currentMonth / 3) + 1;
  let totalWidth = 0;

  let monthAccumulator = 0;
  const quarterStartX = xPos;
  let quarterMonthCount = 0;
  const quarterNumber = Math.floor(currentMonth / 3) + 1;

  const getDaysInQuarter = (year: number, quarter: number): number => {
    const startMonth = (quarter - 1) * 3;
    let days = 0;
    for (let i = 0; i < 3; i++) {
      const monthIndex = (currentMonth + i) % 12;
      const daysInMonth = getDaysInMonths(startDate, i);
      const width = daysInMonth * singleDayWidth;

      monthAccumulator += width;
      quarterMonthCount++;
      days += dayjs(`${year}-${startMonth + i + 1}-01`).daysInMonth();
    }
    return days;
  };

  while (totalWidth <= canvasWidth) {
    const daysInThisQuarter = getDaysInQuarter(currentYear, currentQuarter);
    const width = daysInThisQuarter * singleDayWidth;

    drawRow(
      {
        ctx,
        x: xPos,
        y: yPos,
        width,
        height: headerMonthHeight,
        textYPos: topRowTextYPos,
        label: `Q${currentQuarter} ${currentYear}`,
        font: fonts.topRow
      },
      theme
    );

    xPos += width;
    totalWidth += width;

    // Advance to next quarter
    currentQuarter++;
    if (currentQuarter > 4) {
      currentQuarter = 1;
      currentYear++;
    }
  }
};

//     const yPos = headerMonthHeight; // middle row
//     let xPos = -(startDate.dayOfMonth - 1) * singleDayWidth;

//     // Track month and quarter
//     let currentMonth = startDate.month;
//     let monthAccumulator = 0;
//     let quarterStartX = xPos;
//     let quarterMonthCount = 0;
//     let quarterNumber = Math.floor(currentMonth / 3) + 1;

//     for (let i = 0; i < cols; i++) {
//       const monthIndex = (currentMonth + i) % 12;
//       const daysInMonth = getDaysInMonths(startDate, i);
//       const width = daysInMonth * singleDayWidth;

//       // Accumulate width and months
//       monthAccumulator += width;
//       quarterMonthCount++;

//       // If we've reached 3 months (1 quarter), draw it
//       if (quarterMonthCount === 3) {
//         drawRow(
//           {
//             ctx,
//             x: quarterStartX,
//             y: yPos,
//             width: monthAccumulator,
//             height: headerWeekHeight,
//             textYPos: middleRowTextYPos,
//             label: `Q${quarterNumber}`,
//             font: fonts.bottomRow.name
//           },
//           theme
//         );

//         // Reset for next quarter
//         quarterNumber++;
//         quarterMonthCount = 0;
//         monthAccumulator = 0;
//         quarterStartX = xPos + width;
//       }

//       xPos += width;
//     }

//     // Draw any remaining months if cols ends mid-quarter
//     if (quarterMonthCount > 0) {
//       drawRow(
//         {
//           ctx,
//           x: quarterStartX,
//           y: yPos,
//           width: monthAccumulator,
//           height: headerWeekHeight,
//           textYPos: middleRowTextYPos,
//           label: `Q${quarterNumber}`,
//           font: fonts.bottomRow.name
//         },
//         theme
//       );
//     }
//   };
