import { AnyAction } from "redux";
import { Dispatch } from "react";
import { SchedulerData, SchedulerItemClickData, SchedulerProjectData } from "@/types/global";
export type CalendarProps = {
  data: SchedulerData;
  topBarWidth: number;
  renderData: React.ReactNode;
  schedulerRef: React.RefObject<HTMLDivElement>;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  Users?: any;
  hideCheckedItems?: any;
  onItemClick?: (data: SchedulerItemClickData) => void;
  toggleTheme?: () => void;
  subDispatch?: Dispatch<AnyAction>;
  subEntryActions?: any;
};

export type StyledSpanProps = {
  position: "left" | "right";
};

export type ProjectsData = [projectsPerPerson: SchedulerProjectData[][][], rowsPerPerson: number[]];
