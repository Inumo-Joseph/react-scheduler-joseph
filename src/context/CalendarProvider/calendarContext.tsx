import { createContext } from "react";
import dayjs from "dayjs";
import { CalendarContextType } from "./types";

type TilePositionMap = Record<string, { x: number; y: number; width: number; height: number }>;

export const calendarContext = createContext<CalendarContextType>({
  handleGoNext: () => {},
  handleScrollNext: () => {},
  handleGoPrev: () => {},
  handleScrollPrev: () => {},
  handleGoToday: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
  handleFilterData: () => {},
  zoom: 0,
  isNextZoom: false,
  isPrevZoom: false,
  date: dayjs(),
  isLoading: false,
  cols: 0,
  startDate: {
    hour: 0,
    dayName: "",
    dayOfMonth: 0,
    weekOfYear: 0,
    month: 0,
    monthName: "",
    isCurrentDay: false,
    isBusinessDay: false,
    year: 0,
    dayOfYear: 0
  },
  dayOfYear: 0,
  recordsThreshold: 0,
  config: {
    zoom: 0
  }
});
