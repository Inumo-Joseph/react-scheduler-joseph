import React, { Dispatch } from "react";
import { AnyAction } from "redux";
import {
  Config,
  SchedulerData,
  SchedulerItemClickData,
  SchedulerProjectData
} from "@/types/global";
import { ParsedDatesRange } from "@/utils/getDatesRange";

export type SchedulerRef = {
  handleGoToday: () => void;
};
export type SchedulerProps = {
  data: SchedulerData;
  isLoading?: boolean;
  config?: Config;
  startDate?: string;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  reccuringIcon?: any;
  Users?: any;
  hideCheckedItems?: any;
  onRangeChange?: (range: ParsedDatesRange) => void;
  onFilterData?: () => void;
  onClearFilterData?: () => void;
  onItemClick?: (data: SchedulerItemClickData) => void;
  renderData?: React.ReactNode;
  addTaskButton?: React.ReactNode;
  onAssignTask?: (task: any, updatedTask: any) => void;
  form?: any;
  todayClicked?: any;
  schedulerZoom?: any;
  schedulerTruncate?: boolean;
  schedulerSize?: number;
  setShowAddTaskModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setMousePosition?: React.Dispatch<React.SetStateAction<{ x: number; y: number } | undefined>>;
  setSelectedCard?: React.Dispatch<React.SetStateAction<any>>;
};

export type StyledOutsideWrapperProps = {
  showScroll: boolean;
};
