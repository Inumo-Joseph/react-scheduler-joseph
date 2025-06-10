import React, { Dispatch } from "react";
import { AnyAction } from "redux";
import {
  Config,
  SchedulerData,
  SchedulerItemClickData,
  SchedulerProjectData
} from "@/types/global";
import { ParsedDatesRange } from "@/utils/getDatesRange";
export type SchedulerProps = {
  data: SchedulerData;
  isLoading?: boolean;
  config?: Config;
  startDate?: string;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  Users?: any;
  hideCheckedItems?: any;
  onRangeChange?: (range: ParsedDatesRange) => void;
  onFilterData?: () => void;
  onClearFilterData?: () => void;
  onItemClick?: (data: SchedulerItemClickData) => void;
  renderData?: React.ReactNode;
  subDispatch?: Dispatch<AnyAction>;
  subEntryActions?: any;
  form?: any;
};

export type StyledOutsideWrapperProps = {
  showScroll: boolean;
};
