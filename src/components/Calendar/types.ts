import { AnyAction } from "redux";
import { Dispatch } from "react";
import { SchedulerData, SchedulerItemClickData, SchedulerProjectData } from "@/types/global";
export type CalendarProps = {
  data: SchedulerData;
  topBarWidth: number;
  renderData: React.ReactNode;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  reccuringIcon?: any;
  Users?: any;
  hideCheckedItems?: any;
  addTaskButton?: React.ReactNode;
  onItemClick?: (data: SchedulerItemClickData) => void;
  toggleTheme?: () => void;
  onAssignTask?: (task: any, updatedTask: any) => void;
  form?: any;
  schedulerZoom?: any;
  schedulerTruncateText?: boolean;
  calendarScale?: number; // 0.5 = 50%, 1 = 100%, etc.
  SchedulerRef?: React.RefObject<HTMLDivElement>;
};

export type StyledSpanProps = {
  position: "left" | "right";
};

export type ProjectsData = [projectsPerPerson: SchedulerProjectData[][][], rowsPerPerson: number[]];
