import { prefixId } from "./styles";

export const monthWidth = 84;
export const dayWidth = 50;
export const tileDayWidth = 45;
export const headerMonthHeight = 30;
export const headerWeekHeight = 20;
export const headerDayHeight = 45;
export const headerHeight = headerDayHeight + headerWeekHeight + headerMonthHeight - 56;
export const weekWidth = 84;
export const boxHeight = 56;
export const leftColumnWidth = 196;
export const singleDayWidth = 12;
export const zoom2ColumnWidth = 50;
export const zoom2HeaderTopRowHeight = 24;
export const zoom2HeaderMiddleRowHeight = 16;
export const zoom2HeaderBottomRowHeight = 40;
export const zoom2HeaderHeight =
  zoom2HeaderTopRowHeight + zoom2HeaderMiddleRowHeight + zoom2HeaderBottomRowHeight;
export const zoom2ButtonJump = 1;
export const weeksInYear = 52;
export const navHeight = 44;
export const fonts = {
  topRow: "600 14px Arial",
  middleRow: "400 13px Arial",
  bottomRow: {
    name: "100 10.5px Arial",
    number: "100 10.5px Arial"
  }
};
export const screenWidthMultiplier = 3;
export const dayNameYoffset = 1.6;
export const dayNumYOffset = 4.5;
export const monthsInYear = 12;
export const hoursInDay = 24;
export const canvasHeaderWrapperId = "reactSchedulerCanvasHeaderWrapper";
export const canvasWrapperId = "reactSchedulerCanvasWrapper";
export const outsideWrapperId = prefixId;
export const tileYOffset = 4;
export const tileHeight = 40;
export const formFieldsIds = {
  peopleCount: "peopleCount",
  projectsPerYear: "projectsPerYear",
  yearsCovered: "yearsCovered",
  startDate: "startDate",
  maxRecordsPerPage: "maxRecordsPerPage",
  isFullscreen: "isFullscreen"
};
export const yearViewMonthLabelFont = "bold 12px Inter";
export const yearViewMonthLabelHeight = 16;
export const businessDays = 5;
export const maxHoursPerWeek = 40;
export const maxHoursPerDay = 8;
export const maxHoursPerMonth = 160;
export const topRowTextYPos = headerMonthHeight / 2 + 2;
export const middleRowTextYPos = headerWeekHeight / 2 + headerMonthHeight + 1;
export const buttonWeeksJump = 2;
export const minutesInHour = 60;
