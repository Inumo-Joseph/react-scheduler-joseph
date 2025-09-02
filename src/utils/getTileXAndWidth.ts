import {
  dayWidth,
  minutesInHour,
  monthWidth,
  singleDayWidth,
  tileDayWidth,
  zoom2ColumnWidth
} from "@/constants";
import { DatesRange } from "./getDatesRange";

export const getTileXAndWidth = (item: DatesRange, range: DatesRange, zoom: number) => {
  let cellWidth: number;
  switch (zoom) {
    case 0:
      cellWidth = singleDayWidth;
      break;
    case 2:
      cellWidth = zoom2ColumnWidth;
      break;
    case 3:
      cellWidth = 3;
      break;
    default:
      cellWidth = dayWidth;
  }
  const getX = () => {
    let position;
    switch (zoom) {
      case 2:
        position =
          (item.startDate.diff(range.startDate, "minute") / minutesInHour + 1) * cellWidth -
          cellWidth / 2;
        break;
      case 3:
        position = item.startDate.diff(range.startDate, "day") * cellWidth;
        break;
      default: {
        position = item.startDate.diff(range.startDate, "day") * cellWidth;
      }
    }
    return Math.max(0, position);
  };
  // Only show tiles that are completely within the range
  if (item.startDate.isBefore(range.startDate) || item.endDate.isAfter(range.endDate)) {
    const clampedStartDate = item.startDate.isBefore(range.startDate)
      ? range.startDate
      : item.startDate;

    const clampedEndDate = item.endDate.isAfter(range.endDate) ? range.endDate : item.endDate;

    // width based on clamped values
    const clampedWidth = clampedEndDate.diff(clampedStartDate, "day");

    return { x: getX(), width: clampedWidth };
  }

  // Calculate width for tiles completely within range
  let width;

  switch (zoom) {
    case 0:
      width = (item.endDate.diff(item.startDate, "day") + 1) * cellWidth;
      break;
    case 2:
      width = (item.endDate.diff(item.startDate, "minute") / minutesInHour) * cellWidth;
      break;
    default:
      width = item.endDate.diff(item.startDate, "day") * cellWidth + cellWidth;
  }

  return { x: getX(), width };
};
