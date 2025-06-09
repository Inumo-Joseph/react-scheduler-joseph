import { Dispatch } from "react";
import { AnyAction } from "redux";
import { PaginatedSchedulerData, SchedulerData, SchedulerProjectData } from "@/types/global";

export type GridProps = {
  zoom: number;
  rows: number;
  schedulerRef: React.RefObject<HTMLDivElement>;
  data: PaginatedSchedulerData;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  Users?: any;
  hideCheckedItems?: any;
  onTileClick?: (data: SchedulerProjectData) => void;
  onTileHover?: (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => void;
  renderData?: React.ReactNode;
  projectData: SchedulerData;
  truncateText?: boolean;
  showToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  subDispatch?: Dispatch<AnyAction>;
  subEntryActions?: any;
};

export type StyledSpanProps = {
  position: "left" | "right";
};
