import { Ref } from "react";
import { SchedulerData, SchedulerProjectData } from "@/types/global";

type AddParentChildTaskProps = {
  anotherTrigger?: boolean;
  updateTaskMode?: () => void;
  form: any;
  task: any;
  selectedParentTask: any;
};

export type TileProps = {
  row: number;
  data: SchedulerProjectData;
  zoom: number;
  renderData: React.ReactNode;
  tasks?: any;
  parentChildTask?: (props: AddParentChildTaskProps) => React.ReactNode;
  alarmClock?: any;
  Users?: any;
  hideCheckedItems?: any;
  reportPosition?: (
    id: string,
    pos: { x: number; y: number; width: number; height: number }
  ) => void;
  truncateText?: boolean;
  setTruncate?: React.Dispatch<React.SetStateAction<boolean>>;
  projectData: SchedulerData;
  tileRef?: React.RefObject<HTMLButtonElement>;
  onHover?: React.ReactNode;
};

export type StyledTextProps = {
  bold?: boolean;
  truncateText?: boolean;
};
