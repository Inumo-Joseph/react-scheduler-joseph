import { ReactNode } from "react";
import dayjs from "dayjs";
import { Config, Coords, Day, SchedulerData, ZoomLevel } from "@/types/global";
import { ParsedDatesRange } from "@/utils/getDatesRange";

export type CalendarContextType = {
  handleGoNext: () => void;
  handleScrollNext: () => void;
  handleGoPrev: () => void;
  handleScrollPrev: () => void;
  handleGoToday: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  handleFilterData: () => void;
  onClearFilterData?: () => void;
  data?: SchedulerData;
  zoom: ZoomLevel;
  isNextZoom: boolean;
  isPrevZoom: boolean;
  date: dayjs.Dayjs;
  isLoading: boolean;
  cols: number;
  startDate: Day;
  dayOfYear: number;
  recordsThreshold: number;
  config: Config;
};

type TilePositionMap = Record<string, { x: number; y: number; width: number; height: number }>;

export type CalendarProviderProps = {
  children: ReactNode;
  isLoading: boolean;
  todayClicked: boolean;
  defaultStartDate?: dayjs.Dayjs;
  data?: SchedulerData;
  handleGoToday?: () => void;
  schedulerZoom?: any;
  config: Config;
  onRangeChange?: (range: ParsedDatesRange) => void;
  onFilterData?: () => void;
  onClearFilterData?: () => void;
};
