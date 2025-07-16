import { DragEndEvent } from "@dnd-kit/core";
import { PaginatedSchedulerData, SchedulerData, SchedulerProjectData } from "@/types/global";

export type TilesProps = {
  zoom: number;
  data: PaginatedSchedulerData;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  Users?: any;
  reccuringIcon?: any;
  hideCheckedItems?: any;
  onTileClick?: (data: SchedulerProjectData) => void;
  onTileHover?: (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => void;
  projectData: SchedulerData;
  renderData: React.ReactNode;
  reportPosition?: (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => void;
  tileRef?: React.RefObject<HTMLButtonElement>;
  tilePositions?: Record<string, { x: number; y: number; width: number; height: number }>;
  showToggle: React.Dispatch<React.SetStateAction<boolean>>;
  truncateText?: boolean;
  showCompleted?: boolean;
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  onAssignTask?: (task: any, updatedTask: any) => void;
  form?: any;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  handleDragEnd?: (event: DragEndEvent) => void;
};

export type PlacedTiles = JSX.Element[];
