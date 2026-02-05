import dayjs from "dayjs";
import { boxHeight, tileYOffset, leftColumnHeaderHeight } from "@/constants";
import { TileProperties } from "@/types/global";
import { getTileXAndWidth } from "./getTileXAndWidth";

export const getTileProperties = (
  row: number,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  resourceStartDate: Date,
  resourceEndDate: Date,
  zoom: number
): TileProperties => {
  // Offset tiles below the left column header (search bar + pagination)
  const y = row * boxHeight + tileYOffset + leftColumnHeaderHeight /2 ;
  const rangeStartHour = startDate.hour();
  const rangeEndHour = endDate.hour();
  let parsedResourceStartDate;
  let parsedResourceEndDate;
  let parsedStartDate;
  let parsedEndDate;

  // console.log("Start dATE", startDate.add(0, 'month'))

  switch (zoom) {
    case 2: {
      parsedResourceStartDate = dayjs(resourceStartDate);
      parsedResourceEndDate = dayjs(resourceEndDate);
      parsedStartDate = dayjs(startDate).hour(rangeStartHour).minute(0);
      parsedEndDate = dayjs(endDate).hour(rangeEndHour).minute(0);
      break;
    }
    case 3: {
      parsedResourceStartDate = dayjs(resourceStartDate).hour(0).minute(0);
      parsedResourceEndDate = dayjs(resourceEndDate).hour(23).minute(59);
      parsedStartDate = startDate;
      parsedEndDate = endDate;
      break;
    }
    default: {
      parsedResourceStartDate = dayjs(resourceStartDate).hour(0).minute(0);
      parsedResourceEndDate = dayjs(resourceEndDate).hour(23).minute(59);
      parsedStartDate = startDate;
      parsedEndDate = endDate;
      break;
    }
  }

  return {
    ...getTileXAndWidth(
      { startDate: parsedResourceStartDate, endDate: parsedResourceEndDate },
      { startDate: parsedStartDate, endDate: parsedEndDate },
      zoom
    ),
    y
  };
};
