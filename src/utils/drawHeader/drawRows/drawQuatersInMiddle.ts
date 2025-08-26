import dayjs from "dayjs";
import {
  fonts,
  headerDayHeight,
  headerHeight,
  headerMonthHeight,
  headerWeekHeight,
  middleRowTextYPos,
  monthsInYear,
  monthWidth,
  singleDayWidth,
  topRowTextYPos,
  weekWidth
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
  const yPos = headerMonthHeight - 30; // Position at bottom like other bottom functions
  const quarterLabelY = headerHeight - headerDayHeight / 1.6; // Same Y position as other bottom text
  let xPos = 0;
  let monthIndex = 0;

  let lastDrawnQuarter = -1;
  for (let i = 0; i < cols; i++) {
    monthIndex += 1;
    const currentMonth = dayjs(
      `${startDate.year}-${startDate.month + 1}-${startDate.dayOfMonth}`
    ).add(i, "month");
    const month = currentMonth.month(); // 0-11
    const year = currentMonth.year();

    const quarter = Math.floor(month / 3); // 0, 1, 2, 3 for Q1, Q2, Q3, Q4
    if (quarter !== lastDrawnQuarter && quarter >= 0 && quarter < 4) {
      const quarterLabel = `Q${quarter + 1} - ${year}`;

      drawRow(
        {
          ctx,
          x: xPos,
          y: yPos,
          width: 3 * monthWidth, // 3 months per quarter * monthWidth
          height: headerDayHeight, // Same height as other bottom rows
          textYPos: middleRowTextYPos - 30,
          label: quarterLabel,
          font: fonts.middleRow, // Keep same font as original
          isBottomRow: true // Add this if your drawRow function uses it
        },
        theme
      );

      lastDrawnQuarter = quarter;
    }

    xPos += monthWidth;
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
