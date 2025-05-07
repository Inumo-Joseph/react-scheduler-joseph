import { PaginatedSchedulerData, SchedulerData, SchedulerProjectData } from "@/types/global";

export type TilesProps = {
  zoom: number;
  data: PaginatedSchedulerData;
  onTileClick?: (data: SchedulerProjectData) => void;
  onTileHover?: (data: SchedulerProjectData, ref: React.RefObject<HTMLButtonElement>) => void;
  projectData: SchedulerData;
  renderData?: React.ReactNode;
  reportPosition?: (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => void;
  tileRef?: React.RefObject<HTMLButtonElement>;
  isHidden?: boolean;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export type PlacedTiles = JSX.Element[];
