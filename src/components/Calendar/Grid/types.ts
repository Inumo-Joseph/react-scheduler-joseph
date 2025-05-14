import { PaginatedSchedulerData, SchedulerData, SchedulerProjectData } from "@/types/global";

export type GridProps = {
  zoom: number;
  rows: number;
  schedulerRef: React.RefObject<HTMLDivElement>;
  data: PaginatedSchedulerData;
  onTileClick?: (data: SchedulerProjectData) => void;
  onTileHover?: (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => void;
  renderData?: React.ReactNode;
  projectData: SchedulerData;
  truncateText?: boolean;
  showToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export type StyledSpanProps = {
  position: "left" | "right";
};
