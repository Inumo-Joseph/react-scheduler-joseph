import { Dispatch } from "react";
import { AnyAction } from "redux";
import { PaginatedSchedulerData, SchedulerData, SchedulerProjectData } from "@/types/global";

export type TilesProps = {
  zoom: number;
  data: PaginatedSchedulerData;
  tasks?: any;
  parentChildTask?: any;
  alarmClock?: any;
  Users?: any;
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
  showToggle: React.Dispatch<React.SetStateAction<boolean>>;
  truncateText?: boolean;
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  subDispatch?: Dispatch<AnyAction>;
  subEntryActions?: any;
  form?: any;
};

export type PlacedTiles = JSX.Element[];
