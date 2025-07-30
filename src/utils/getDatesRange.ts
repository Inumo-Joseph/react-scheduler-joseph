import dayjs from "dayjs";
import { getCols } from "./getCols";

export type DatesRange = {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
};

export type ParsedDatesRange = {
  startDate: Date;
  endDate: Date;
};

export const getDatesRange = (date: dayjs.Dayjs, zoom: number): DatesRange => {
  const colsOffset = Math.round(getCols(zoom) / 2);

  let startDate;

  // console.log("=== getDatesRange Debug ===");
  // console.log("zoom:", zoom);
  // console.log("getCols(zoom):", getCols(zoom));
  // console.log("colsOffset:", colsOffset);
  // console.log("input date:", date.format('YYYY-MM-DD'));

  switch (zoom) {
    case 1:
      startDate = date.subtract(colsOffset, "days");
      break;
    case 2:
      startDate = date.subtract(colsOffset, "hours");
      break;
    case 3:
      startDate = date.subtract(colsOffset, "months");
      break;
    default:
      startDate = date.subtract(colsOffset, "weeks");
      break;
  }

  let endDate;
  switch (zoom) {
    case 1:
      endDate = date.add(colsOffset, "days");
      break;
    case 2:
      endDate = date.add(colsOffset, "hours");
      break;
    case 3:
      endDate = date.add(colsOffset, "months");
      break;
    default:
      endDate = date.add(colsOffset, "weeks");
      break;
  }

  return {
    startDate,
    endDate
  };
};

export const getParsedDatesRange = (date: dayjs.Dayjs, zoom: number): ParsedDatesRange => {
  const dates = getDatesRange(date, zoom);

  return {
    startDate: dates.startDate.toDate(),
    endDate: dates.endDate.toDate()
  };
};
