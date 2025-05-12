import { SchedulerData, SchedulerItemClickData, SchedulerProjectData } from "@/types/global";

export type CalendarProps = {
  data: SchedulerData;
  topBarWidth: number;
  onItemClick?: (data: SchedulerItemClickData) => void;
  toggleTheme?: () => void;
  renderData: React.ReactNode;
  schedulerRef?: React.RefObject<HTMLDivElement>;
};

export type StyledSpanProps = {
  position: "left" | "right";
};

export type ProjectsData = [projectsPerPerson: SchedulerProjectData[][][], rowsPerPerson: number[]];
