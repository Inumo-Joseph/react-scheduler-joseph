import dayjs from "dayjs";
import { Theme } from "@/styles";
import { fonts, topRowTextYPos, headerMonthHeight, singleDayWidth } from "@/constants";
import { Day } from "@/types/global";
import { drawRow } from "../../drawRow";

export const drawQuartersOnTop = (
  ctx: CanvasRenderingContext2D,
  startDate: Day,
  dayOfYear: number,
  theme: Theme
) => {
  const yPos = 0;
  const canvasWidth = ctx.canvas.width * 2;
  let xPos = 0;
  let currentYear = startDate.year;

  const currentMonth = startDate.month;
  const startMonthIndex = dayjs(
    `${startDate.year}-${startDate.month}-${startDate.dayOfMonth}`
  ).month();
  let currentQuarter = Math.floor(currentMonth / 3) + 1;
  console.log("Current startMonthINdex", startMonthIndex);

  let totalWidth = 0;

  const getDaysInQuarter = (year: number, quarter: number): number => {
    const startMonth = (quarter - 1) * 3;
    let days = 0;
    for (let i = 0; i < 3; i++) {
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
