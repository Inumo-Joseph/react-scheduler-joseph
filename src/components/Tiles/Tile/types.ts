import { Ref } from "react";
import { SchedulerData, SchedulerProjectData } from "@/types/global";

export type TileProps = {
  row: number;
  data: SchedulerProjectData;
  zoom: number;
  renderData: React.ReactNode;
  reportPosition?: (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => void;
  truncateText?: boolean;
  setTruncate?: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: SchedulerData;
  tileRef?: React.RefObject<HTMLButtonElement>;
};

export type StyledTextProps = {
  bold?: boolean;
  truncateText?: boolean;
};
