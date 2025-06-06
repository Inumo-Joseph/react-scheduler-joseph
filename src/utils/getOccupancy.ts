import dayjs from "dayjs";
import { SchedulerProjectData, OccupancyData, ZoomLevel } from "@/types/global";
import { getWeekOccupancy } from "./getWeekOccupancy";
import { getDayOccupancy } from "./getDayOccupancy";
import { getHourOccupancy } from "./getHourOccupancy";

export const getOccupancy = (
  resource: SchedulerProjectData[][],
  resourceIndex: number,
  focusedDate: dayjs.Dayjs,
  zoom: ZoomLevel,
  includeTakenHoursOnWeekendsInDayView = false
): OccupancyData => {
  if (resourceIndex < 0)
    return {
      taken: { hours: 0, minutes: 0 },
      free: { hours: 0, minutes: 0 },
      overtime: { hours: 0, minutes: 0 }
    };

  const occupancy = resource.flat(2).filter((item) => {
    if (zoom === 1) {
      return dayjs(focusedDate).isBetween(item.startDate, item.dueDate, "day", "[]");
    } else if (zoom === 2) {
      return dayjs(focusedDate).isBetween(item.startDate, item.dueDate, "hour", "[]");
    } else {
      return (
        dayjs(item.startDate).isBetween(
          dayjs(focusedDate),
          dayjs(focusedDate).add(6, "days"),
          "day",
          "[]"
        ) || dayjs(focusedDate).isBetween(dayjs(item.startDate), dayjs(item.dueDate), "day", "[]")
      );
    }
  });

  switch (zoom) {
    case 2:
      return getDayOccupancy(occupancy, focusedDate, zoom, includeTakenHoursOnWeekendsInDayView);
    case 3:
      return getHourOccupancy(occupancy, focusedDate);
    default:
      return getWeekOccupancy(occupancy, focusedDate, zoom);
  }
};
