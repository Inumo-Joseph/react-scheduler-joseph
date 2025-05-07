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
  onRangeChange?: (range: ParsedDatesRange) => void;
  onFilterData?: () => void;
  onClearFilterData?: () => void;
  onItemClick?: (data: SchedulerItemClickData) => void;
  renderData?: React.ReactNode;
  isHidden?: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export type StyledOutsideWrapperProps = {
  showScroll: boolean;
};
