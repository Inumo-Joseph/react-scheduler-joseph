import { Dispatch } from "react";
import { AnyAction } from "redux";
import { PaginatedSchedulerData, SchedulerData, SchedulerProjectData } from "@/types/global";

export type GridProps = {
  zoom: number;
  rows: number;
  data: PaginatedSchedulerData;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  reccuringIcon?: any;
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
  onAssignTask?: (task: any, updatedTask: any, flag: any) => void;
  form?: any;
  calendarScale?: any;
  SchedulerRef?: React.RefObject<HTMLDivElement>;
  handleDragEnd?: (event: any) => void;
  filteredData?: any;
  setClickedTask?: React.Dispatch<React.SetStateAction<any>>;
  taskInteractionProps?: TaskInteractionHandlers;
};

export interface TaskInteractionHandlers {
  setMousePosition?: React.Dispatch<React.SetStateAction<{ x: number; y: number } | undefined>>;
  setSelectedDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setShowAddTaskModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCard?: React.Dispatch<React.SetStateAction<any>>;
}

export type StyledSpanProps = {
  position: "left" | "right";
};
