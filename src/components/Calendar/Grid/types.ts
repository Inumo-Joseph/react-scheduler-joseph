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
  showCompleted?: boolean;
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  onAssignTask?: (task: any, updatedTask: any) => void;
  form?: any;
  calendarScale?: any;
  SchedulerRef?: React.RefObject<HTMLDivElement>;
};

export type StyledSpanProps = {
  position: "left" | "right";
};
