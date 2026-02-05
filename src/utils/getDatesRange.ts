import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { getCols } from "./getCols";

dayjs.extend(isoWeek);

export type DatesRange = {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
};

export type ParsedDatesRange = {
  startDate: Date;
  endDate: Date;
};

/**
 * Get the date range for the calendar view.
 *
 * IMPORTANT: startDate is normalized to calendar boundaries so headers and tiles align:
 * - Week view (zoom=0): startDate is normalized to Monday (start of ISO week)
 * - Day view (zoom=1): startDate is the exact day
 * - Hour view (zoom=2): startDate is the exact hour
 * - Month view (zoom=3): startDate is normalized to 1st of month
 */
export const getDatesRange = (date: dayjs.Dayjs, zoom: number): DatesRange => {
  const cols = getCols(zoom);
  const colsOffset = Math.round(cols / 2);

  let startDate;

  switch (zoom) {
    case 1:
      // Day view: exact days
      startDate = date.subtract(colsOffset, "days");
      break;
    // case 2:
    //   // Hour view: exact hours
    //   startDate = date.subtract(colsOffset, "hours");
    //   break;
    case 3:
      // Month view: normalize to 1st of month for header alignment
      startDate = date.subtract(colsOffset, "months").startOf("month");
      break;
    default:
      // Week view (zoom=0): normalize to Monday for header alignment
      startDate = date.subtract(colsOffset, "weeks").startOf("isoWeek");
      break;
  }

  let endDate;
  switch (zoom) {
    case 1:
      endDate = date.add(colsOffset, "days");
      break;
    // case 2:
    //   endDate = date.add(colsOffset, "hours");
    //   break;
    case 3:
      // Month view: normalize to end of month
      endDate = date.add(colsOffset, "months").endOf("month");
      break;
    default:
      // Week view: normalize to Sunday
      endDate = date.add(colsOffset, "weeks").endOf("isoWeek");
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
